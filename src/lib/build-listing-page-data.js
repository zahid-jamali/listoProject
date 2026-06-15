import { fetchListoJson } from "@/lib/listo-proxy";

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

export async function buildListingPageData(body = {}, req = null) {
  const listing = { ...(body?.listing || body) };
  let id = listing?.id || body?.id;
  let type = listing?.type || body?.type || "RS";
  let brd = listing?.brd || body?.brd;
  const status = body?.status || listing?.status || "A";

  if (!id) {
    throw new Error("Missing required listing id");
  }

  if (!listing?.addr || !listing?.lp_dol) {
    const rows = await fetchListoJson(
      "/api/listings",
      { type, id, limit: 1, out: "M" },
      { req }
    );

    if (rows?.rows?.[0]) {
      Object.assign(listing, rows.rows[0]);
      type = listing.type || type;
      brd = listing.brd || brd;
    }
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

  return {
    success: true,
    property: listing,
    hero: {
      title: listing?.addr || listing?.title || null,
      subtitle:
        [listing?.community, listing?.municipality].filter(Boolean).join(" • ") ||
        null,
      price: listing?.lp_dol || null,
      priceText: listing?.lp_dol_text || null,
      status: statusLabel(listing?.status),
      statusCode: listing?.status || null,
      beds: listing?.br || null,
      baths: listing?.bath_tot || null,
      sqft: listing?.sqft || null,
      propertyType: listing?.sub_type2 || listing?.sub_type || null,
      heroImage,
      photos,
      badges: listing?.badges1 || [],
    },
    details: {
      mlsId: listing?.id || null,
      propertyType: listing?.sub_type2 || null,
      propertyClass: listing?.sub_type || null,
      propertyStyle: listing?.style || null,
      status: statusLabel(listing?.status),
      exterior: listing?.exterior || null,
      yearBuilt: listing?.age || null,
      lotWidth: listing?.lot_width || null,
      lotDepth: listing?.lot_depth || null,
      taxes: listing?.taxes || null,
      maintenance: listing?.maint || null,
      parking: listing?.gar_spaces || null,
      pool: listing?.pool || null,
      crossStreet: listing?.cross_st || null,
      saleType: listing?.s_r || null,
      features: extractFeatures(listing),
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
      walkscore: listing?.walkscore || null,
      municipality: listing?.municipality || null,
      community: listing?.community || null,
      area: listing?.area || null,
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
