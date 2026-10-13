import { fetchListoJson } from "@/lib/listo-proxy";
import {
  enrichListingFromHtml,
  pickPair,
} from "@/lib/enrich-listing-from-html";

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  const cleaned = String(value)
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");
  if (!cleaned) return null;

  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

function mortgagePayment(principal, annualRate, years) {
  if (!principal || !annualRate || !years) return null;

  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  if (monthlyRate === 0) {
    return principal / months;
  }

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

function affordabilityGrade(monthlyCost, annualIncome) {
  if (!monthlyCost || !annualIncome) return null;

  const monthlyIncome = annualIncome / 12;
  const ratio = monthlyCost / monthlyIncome;

  if (ratio <= 0.28) return "A";
  if (ratio <= 0.34) return "B";
  if (ratio <= 0.4) return "C";
  if (ratio <= 0.46) return "D";
  return "E";
}

function normalizePhotos(listing, apiPhotos = []) {
  const fromApi = (apiPhotos || [])
    .map((photo) => (typeof photo === "string" ? photo : photo?.src))
    .filter(Boolean);

  const fromListing = (listing?.photos || [])
    .map((photo) => (typeof photo === "string" ? photo : photo?.src))
    .filter(Boolean);

  const merged = [...fromApi, ...fromListing];
  return [...new Set(merged)].map((src) => ({ src }));
}

function extractFeatures(listing) {
  const badgeFeatures = (listing?.badges2 || [])
    .map((badge) => badge?.text)
    .filter(Boolean);

  const listingFeatures = Array.isArray(listing?.features)
    ? listing.features
    : [];

  return [...new Set([...badgeFeatures, ...listingFeatures])].slice(0, 12);
}

function statusLabel(status) {
  const map = {
    A: "Active",
    U: "Unavailable",
    S: "Sold",
    L: "Leased",
  };

  return map[status] || status || "Active";
}

function isLeaseListing(listing) {
  return String(listing?.s_r || "").toLowerCase() === "lease";
}

function isUsablePrice(value, text = "") {
  const num = toNumber(value);
  if (!num || num <= 0) return false;
  if (/x/i.test(String(text || value || ""))) return false;
  return true;
}

function asList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.rows)) return data.rows;
  return [data];
}

function addrKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/#.*$/, "")
    .replace(/[^a-z0-9]+/g, "");
}

function matchesListingAddress(listing, row) {
  const listingKey = addrKey(listing?.addr);
  if (!listingKey) return false;
  const rowKey =
    addrKey(row?.name) + addrKey(row?.access_url) + addrKey(row?.addr);
  return rowKey.includes(listingKey);
}

function withMonthlySuffix(text) {
  const value = String(text || "").trim();
  if (!value) return null;
  if (/\/\s*(mth|mo|month)/i.test(value)) return value;
  return `${value} /mth`;
}

function pickSaleHitFromSearch(listing, searchData) {
  const homes = asList(searchData).filter(
    (row) => String(row?.category || "").toUpperCase() === "HOMES",
  );

  return (
    homes.find((row) => {
      const heading = String(row?.sub_heading || "");
      const url = String(row?.access_url || "");
      const isSale =
        /for\s*sale/i.test(heading) ||
        url.includes("-for-sale/") ||
        String(row?.s_r || "") === "Sale";
      return (
        isSale &&
        matchesListingAddress(listing, row) &&
        isUsablePrice(row?.lp_dol, row?.lp_dol)
      );
    }) || null
  );
}

function resolveHeroPrice(listing, saleHit) {
  const nativeIsLease = isLeaseListing(listing);
  const nativePrice = listing?.lp_dol || null;
  const nativeText = listing?.lp_dol_text || null;
  const nativeUsable = isUsablePrice(nativePrice, nativeText);
  const nativeKind = nativeIsLease ? "lease" : "sale";
  const nativeDisplayText = nativeIsLease
    ? withMonthlySuffix(nativeText)
    : nativeText;

  if (!nativeIsLease && nativeUsable) {
    return {
      price: nativePrice,
      priceText: nativeText,
      priceKind: "sale",
      priceLabel: "List price",
      leasePriceText: null,
      nativePrice,
      nativePriceText: nativeText,
      nativeKind: "sale",
    };
  }

  const saleRaw = saleHit?.lp_dol || saleHit?.lp_dol_text || null;
  const saleText =
    typeof saleRaw === "string" && saleRaw.includes("$")
      ? saleRaw
      : saleHit?.lp_dol_text || null;

  if (saleHit && isUsablePrice(saleRaw, saleText || saleRaw)) {
    return {
      price: toNumber(saleRaw),
      priceText: saleText,
      priceKind: "sale",
      priceLabel: "List price",
      leasePriceText: nativeUsable ? nativeDisplayText : null,
      nativePrice,
      nativePriceText: nativeDisplayText,
      nativeKind,
    };
  }

  return {
    price: nativePrice,
    priceText: nativeDisplayText,
    priceKind: nativeKind,
    priceLabel: nativeIsLease ? "For lease" : "List price",
    leasePriceText: null,
    nativePrice,
    nativePriceText: nativeDisplayText,
    nativeKind,
  };
}

export async function buildListingPageData(body = {}, req = null) {
  const listing = { ...(body?.listing || body) };
  let id = listing?.id || body?.id;
  let type = listing?.type || body?.type || "RS";
  let brd = listing?.brd || body?.brd;
  const status = body?.status || listing?.status || "A";

  if (!id) {
    throw new Error("Missing required listing id");
  }

  // When we only have identifiers (direct visit / SEO / shared link), fetch the
  // full record. We forward every hint we have and then VERIFY the returned row
  // actually matches the requested id, so we never render the wrong property if
  // the upstream search ignores the id filter.
  const needsCardFetch =
    !listing?.addr || !listing?.lp_dol || !listing?.access_url;

  if (needsCardFetch) {
    const rows = await fetchListoJson(
      "/api/listings",
      {
        type,
        id,
        brd,
        s_r: body?.s_r || listing?.s_r || "",
        sub_type: body?.sub_type || listing?.sub_type || "",
        area_slug: body?.area_slug || listing?.area_slug || "",
        munc_slug: body?.munc_slug || listing?.munc_slug || "",
        loc_type: body?.loc_type || listing?.loc_type || "",
        search_text:
          body?.search_text ||
          listing?.search_text ||
          body?.munc_slug ||
          listing?.munc_slug ||
          "",
        limit: 50,
        out: "M",
        sort: "ld",
        order: "desc",
      },
      { req },
    ).catch(() => null);

    const match = (rows?.rows || []).find(
      (r) => String(r.id) === String(id),
    );

    if (match) {
      Object.assign(listing, match);
      type = listing.type || type;
      brd = listing.brd || brd;
    }
  }

  // Public list APIs omit ad_text / rooms / utilities. Enrich from the SSR
  // listing page HTML (same source legacy detail tabs use).
  const enrichment = listing?.access_url
    ? await enrichListingFromHtml(listing.access_url, req)
    : null;

  if (enrichment?.ad_text && !listing.ad_text) {
    listing.ad_text = enrichment.ad_text;
  }
  if (enrichment?.extras && !listing.extras) {
    listing.extras = enrichment.extras;
  }
  if (enrichment?.rooms?.length) {
    listing.rooms = enrichment.rooms;
  }

  const zip = body?.zip || listing?.zip || "";
  const area_slug = body?.area_slug || listing?.area_slug || "";
  const munc_slug = body?.munc_slug || listing?.munc_slug || "";
  const comm_slug = body?.comm_slug || listing?.comm_slug || "";

  const downPaymentPercent = toNumber(body?.downPaymentPercent) ?? 20;
  const interestRate = toNumber(body?.interestRate) ?? 5.4;
  const termYears = toNumber(body?.termYears) ?? 25;
  const annualIncome = toNumber(body?.annualIncome) ?? 180000;

  const price = toNumber(listing?.lp_dol);
  const taxesAnnual = toNumber(listing?.taxes);
  const downPayment = price ? (price * downPaymentPercent) / 100 : null;
  const loanAmount = price && downPayment ? price - downPayment : null;
  const mortgageMonthly = mortgagePayment(loanAmount, interestRate, termYears);
  const propertyTaxMonthly =
    taxesAnnual && taxesAnnual > 0
      ? taxesAnnual / 12
      : price
      ? (price * 0.004) / 12
      : null;
  const closingCostsEstimate = price ? price * 0.0175 : null;
  const estimatedMonthly =
    mortgageMonthly && propertyTaxMonthly
      ? mortgageMonthly + propertyTaxMonthly
      : mortgageMonthly;

  const fetchJson = (path, params = {}) =>
    fetchListoJson(path, params, { req }).catch(() => null);

  const [
    photosResult,
    activeCompsResult,
    soldCompsResult,
    insightsResult,
    priceChangesResult,
    openHousesResult,
    marketTrendResult,
    saleSearchResult,
  ] = await Promise.allSettled([
    fetchJson("/api/listingPhotos", { id, type, brd }),
    fetchJson("/api/get_comps", { id, status }),
    fetchJson("/api/get_comps", { id, type: "SD", status }),
    fetchJson("/api/get_insights", { id, type }),
    zip
      ? fetchJson("/api/listingpricechanges", { prop_id: id, incl_total: 1 })
      : Promise.resolve(null),
    zip
      ? fetchJson("/v1/api/get-open-houses", { zip, limit: 6 })
      : Promise.resolve(null),
    area_slug && munc_slug
      ? fetchJson("/api/get_sold_monthly_chart_series", {
          location_type: comm_slug ? "COMM" : "MUNC",
          area_slug,
          munc_slug,
          comm_slug,
        })
      : Promise.resolve(null),
    isLeaseListing(listing) && listing?.addr
      ? fetchJson("/api/main_search/", {
          q: [listing.addr, listing.municipality].filter(Boolean).join(", "),
          s_r: "Sale",
        })
      : Promise.resolve(null),
  ]);

  const photos = normalizePhotos(
    listing,
    photosResult.status === "fulfilled" ? photosResult.value : []
  );

  const activeComparisons =
    activeCompsResult.status === "fulfilled"
      ? activeCompsResult.value?.rows || []
      : [];

  const soldComparisons =
    soldCompsResult.status === "fulfilled"
      ? soldCompsResult.value?.rows || []
      : [];

  const insights =
    insightsResult.status === "fulfilled" &&
    Array.isArray(insightsResult.value)
      ? insightsResult.value
      : [];

  const priceChanges =
    priceChangesResult.status === "fulfilled"
      ? priceChangesResult.value?.rows || []
      : [];

  const openHouses =
    openHousesResult.status === "fulfilled"
      ? openHousesResult.value?.rows || openHousesResult.value || []
      : [];

  const marketTrends =
    marketTrendResult.status === "fulfilled" &&
    Array.isArray(marketTrendResult.value)
      ? marketTrendResult.value
      : [];

  const heroImage = photos?.[0]?.src || listing?.thumbnail || null;
  const propertyPairs = enrichment?.propertyPairs || {};
  const detailPairs = enrichment?.detailPairs || {};
  const entityAi = enrichment?.entityAi || {};

  const bedsDisplay =
    pickPair(detailPairs, "Bedrooms") ||
    (listing?.br != null
      ? `${listing.br}${listing?.br_plus ? "+" : ""}`
      : null);
  const bathsDisplay =
    pickPair(detailPairs, "Bathrooms") || listing?.bath_tot || null;
  const basement =
    pickPair(propertyPairs, "Basement") ||
    [listing?.bsmt1_out, listing?.bsmt2_out].filter(Boolean).join(" ") ||
    entityAi?.basement ||
    null;

  const saleHit = pickSaleHitFromSearch(
    listing,
    saleSearchResult.status === "fulfilled" ? saleSearchResult.value : null,
  );
  const heroPrice = resolveHeroPrice(listing, saleHit);

  return {
    success: true,
    property: listing,
    hero: {
      title: listing?.addr || listing?.title || null,
      subtitle:
        [listing?.community, listing?.municipality].filter(Boolean).join(" • ") ||
        null,
      price: heroPrice.price,
      priceText: heroPrice.priceText,
      priceKind: heroPrice.priceKind,
      priceLabel: heroPrice.priceLabel,
      leasePriceText: heroPrice.leasePriceText,
      nativePrice: heroPrice.nativePrice,
      nativePriceText: heroPrice.nativePriceText,
      nativeKind: heroPrice.nativeKind,
      status: statusLabel(listing?.status),
      statusCode: listing?.status || null,
      beds: bedsDisplay || listing?.br || null,
      baths: bathsDisplay || listing?.bath_tot || null,
      sqft: listing?.sqft || entityAi?.size || null,
      propertyType:
        pickPair(propertyPairs, "Property Type") ||
        listing?.type_own1_out ||
        listing?.sub_type2 ||
        listing?.sub_type ||
        null,
      heroImage,
      photos,
      badges: listing?.badges1 || [],
    },
    details: {
      mlsId:
        pickPair(propertyPairs, "MLS#", "MLS") || listing?.id || null,
      propertyType:
        pickPair(propertyPairs, "Property Type") ||
        listing?.type_own1_out ||
        listing?.sub_type2 ||
        null,
      propertyClass: listing?.sub_type || null,
      propertyStyle:
        pickPair(propertyPairs, "Property Style") ||
        listing?.style ||
        entityAi?.style ||
        null,
      area:
        pickPair(propertyPairs, "Area") ||
        listing?.area ||
        entityAi?.area ||
        null,
      community:
        pickPair(propertyPairs, "Community") ||
        listing?.community ||
        entityAi?.community ||
        null,
      status:
        pickPair(propertyPairs, "Status") || statusLabel(listing?.status),
      exterior:
        pickPair(propertyPairs, "Outside") ||
        listing?.constr1_out ||
        listing?.exterior ||
        null,
      yearBuilt:
        pickPair(propertyPairs, "Year Built") ||
        listing?.yr_built ||
        listing?.age ||
        entityAi?.yearBuilt ||
        null,
      basement,
      brokerage:
        pickPair(propertyPairs, "Brokerage") || listing?.rltr || null,
      lotWidth:
        pickPair(propertyPairs, "Lot Frontage") ||
        listing?.front_ft ||
        listing?.lot_width ||
        null,
      lotDepth:
        pickPair(propertyPairs, "Lot Depth") ||
        listing?.depth ||
        listing?.lot_depth ||
        null,
      taxes:
        pickPair(propertyPairs, "Taxes") || listing?.taxes || null,
      taxYear: listing?.yr || null,
      added: pickPair(propertyPairs, "Added") || listing?.ld || null,
      maintenance: listing?.maint || null,
      parking:
        listing?.gar_spaces ||
        listing?.tot_park_spcs ||
        entityAi?.totalParkingSpaces ||
        null,
      pool: listing?.pool || entityAi?.poolAvailability || null,
      crossStreet:
        pickPair(detailPairs, "Intersection") ||
        listing?.cross_st ||
        null,
      roomsCount: pickPair(detailPairs, "Rooms") || listing?.rms || null,
      beds: bedsDisplay,
      baths: bathsDisplay,
      fireplace: pickPair(detailPairs, "Fireplace") || listing?.fpl_num || null,
      water: pickPair(detailPairs, "Water") || listing?.water || null,
      cooling:
        pickPair(detailPairs, "Cooling") ||
        listing?.a_c ||
        entityAi?.airCondition ||
        null,
      heating:
        pickPair(detailPairs, "Heating Type") ||
        listing?.heating ||
        entityAi?.heating ||
        null,
      heatingFuel:
        pickPair(detailPairs, "Heating Fuel") || listing?.fuel || null,
      saleType: listing?.s_r || null,
      features: extractFeatures(listing),
      rooms: listing?.rooms || enrichment?.rooms || [],
      adText: listing?.ad_text || enrichment?.ad_text || null,
      extras: listing?.extras || enrichment?.extras || null,
    },
    calculator: {
      inputs: {
        homePrice: price,
        downPaymentPercent,
        interestRate,
        termYears,
        annualIncome,
      },
      results: {
        downPayment,
        loanAmount,
        mortgageMonthly,
        propertyTaxMonthly,
        closingCostsEstimate,
        estimatedMonthly,
        affordabilityScore: affordabilityGrade(estimatedMonthly, annualIncome),
      },
    },
    contact: {
      agent: listing?.agent || {
        name: listing?.agent_name || null,
        phone: listing?.agent_phone || null,
        email: listing?.agent_email || null,
        thumbnail: listing?.ag_thumbnail || null,
      },
      defaultMessage: listing?.addr
        ? `I'm interested in ${listing.addr}. Please contact me with more information.`
        : "I'm interested in this property. Please contact me with more information.",
    },
    neighborhood: {
      lat: listing?.lat || null,
      lng: listing?.lng || null,
      municipality: listing?.municipality || null,
      community: listing?.community || null,
      area: listing?.area || null,
      vibe: enrichment?.neighborhoodVibe || null,
      walkscore: enrichment?.walkscore || null,
    },
    comparisons: {
      active: activeComparisons,
      sold: soldComparisons,
    },
    insights,
    priceChanges: {
      total:
        priceChangesResult.status === "fulfilled"
          ? priceChangesResult.value?.total || priceChanges.length
          : 0,
      rows: priceChanges,
    },
    openHouses,
    marketTrends,
    meta: {
      listingId: id,
      type,
      brd,
      counts: {
        photos: photos.length,
        activeComparisons: activeComparisons.length,
        soldComparisons: soldComparisons.length,
        insights: insights.length,
        openHouses: openHouses.length,
        trendPoints: marketTrends.length,
      },
    },
  };
}
