import { NextResponse } from "next/server";
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

function fetchJson(path, params = {}) {
  return fetchListoJson(path, params, { req: null });
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

export async function POST(req) {
  try {
    const body = await req.json();

    const listing = body?.listing || {};
    const id = body?.id || listing?.id;
    const type = body?.type || listing?.type || "RS";
    const status = body?.status || listing?.status || "";
    const zip = body?.zip || listing?.zip || "";
    const area_slug = body?.area_slug || listing?.area_slug || "";
    const munc_slug = body?.munc_slug || listing?.munc_slug || "";
    const comm_slug = body?.comm_slug || listing?.comm_slug || "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required listing id",
        },
        { status: 400 }
      );
    }

    const downPaymentPercent = toNumber(body?.downPaymentPercent) ?? 20;
    const interestRate = toNumber(body?.interestRate) ?? 5.4;
    const termYears = toNumber(body?.termYears) ?? 25;
    const annualIncome = toNumber(body?.annualIncome) ?? 180000;

    const price = toNumber(listing?.lp_dol);
    const taxesAnnual = toNumber(listing?.taxes);
    const downPayment = price ? (price * downPaymentPercent) / 100 : null;
    const loanAmount = price && downPayment ? price - downPayment : null;
    const mortgageMonthly = mortgagePayment(
      loanAmount,
      interestRate,
      termYears
    );
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

    const [
      photosResult,
      activeCompsResult,
      soldCompsResult,
      insightsResult,
      priceChangesResult,
      openHousesResult,
      marketTrendResult,
    ] = await Promise.allSettled([
      fetchJson("/api/listingPhotos", { id, type }),
      fetchJson("/api/get_comps", { id, status }),
      fetchJson("/api/get_comps", { id, type: "SD", status }),
      fetchJson("/api/get_insights", { id }),
      zip
        ? fetchJson("/api/listingpricechanges", { prop_id: id, incl_total: 1 })
        : null,
      zip
        ? fetchJson("/v1/api/get-open-houses", { zip, limit: 6 })
        : null,
      area_slug && munc_slug
        ? fetchJson("/api/get_sold_monthly_chart_series", {
            location_type: comm_slug ? "COMM" : "MUNC",
            area_slug,
            munc_slug,
            comm_slug,
          })
        : null,
    ]);

    const photos =
      photosResult.status === "fulfilled" && Array.isArray(photosResult.value)
        ? photosResult.value
        : [];

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

    const response = {
      success: true,

      property: listing,

      hero: {
        title: listing?.addr || listing?.title || null,
        subtitle: listing?.community || listing?.municipality || null,
        price: listing?.lp_dol || null,
        priceText: listing?.lp_dol_text || null,
        status: listing?.status || null,
        beds: listing?.br || null,
        baths: listing?.bath_tot || null,
        sqft: listing?.sqft || null,
        heroImage,
        photos,
      },

      details: {
        mlsId: listing?.id || null,
        propertyType: listing?.sub_type2 || null,
        propertyClass: listing?.sub_type || null,
        propertyStyle: listing?.style || null,
        status: listing?.status || null,
        exterior: listing?.exterior || null,
        yearBuilt: listing?.age || null,
        lotWidth: listing?.lot_width || null,
        lotDepth: listing?.lot_depth || null,
        taxes: listing?.taxes || null,
        maintenance: listing?.maint || null,
        parking: listing?.gar_spaces || null,
        pool: listing?.pool || null,
        features: listing?.features || [],
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
          affordabilityScore: affordabilityGrade(
            estimatedMonthly,
            annualIncome
          ),
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
        quickActions: [
          "Book a Tour",
          "Financing Help",
          "Ask About Schools",
          "Offer Strategy",
          "Similar Homes",
        ],
      },

      neighborhood: {
        lat: listing?.lat || null,
        lng: listing?.lng || null,
        walkscore: listing?.walkscore || null,
        nearbyPlaces: listing?.nearby_places || null,
        area_slug,
        munc_slug,
        comm_slug,
        municipality: listing?.municipality || null,
        community: listing?.community || null,
      },

      comparisons: {
        active: activeComparisons,
        sold: soldComparisons,
      },

      insights: insights,

      priceChanges: {
        total:
          priceChangesResult.status === "fulfilled"
            ? priceChangesResult.value?.total || priceChanges.length
            : 0,
        rows: priceChanges,
      },

      openHouses: openHouses,

      marketTrends: marketTrends,

      localCards: {
        recentSolds: {
          title: "Recent Solds",
          location: listing?.municipality || null,
          query: {
            type: "SD",
            l_type: "SD",
            loc_type: "MUNC",
            area_slug,
            munc_slug,
            sub_type: "RES",
          },
        },
        priceChanges: {
          title: "Price changes",
          location: listing?.municipality || null,
          query: {
            area_slug,
            munc_slug,
            comm_slug,
          },
        },
        assignmentSales: {
          title: "Assignment Sales",
          location: listing?.municipality || null,
          query: {
            area_slug,
            munc_slug,
          },
        },
        openHouses: {
          title: "Open Houses",
          location: listing?.municipality || null,
          query: {
            area_slug,
            munc_slug,
            zip,
          },
        },
      },

      meta: {
        listingId: id,
        type,
        counts: {
          photos: photos.length,
          activeComparisons: activeComparisons.length,
          soldComparisons: soldComparisons.length,
          insights: insights.length,
          openHouses: openHouses.length,
          trendPoints: marketTrends.length,
        },
        errors: {
          photos:
            photosResult.status === "rejected"
              ? photosResult.reason?.message || "Failed"
              : null,
          activeComparisons:
            activeCompsResult.status === "rejected"
              ? activeCompsResult.reason?.message || "Failed"
              : null,
          soldComparisons:
            soldCompsResult.status === "rejected"
              ? soldCompsResult.reason?.message || "Failed"
              : null,
          insights:
            insightsResult.status === "rejected"
              ? insightsResult.reason?.message || "Failed"
              : null,
          priceChanges:
            priceChangesResult.status === "rejected"
              ? priceChangesResult.reason?.message || "Failed"
              : null,
          openHouses:
            openHousesResult.status === "rejected"
              ? openHousesResult.reason?.message || "Failed"
              : null,
          marketTrends:
            marketTrendResult.status === "rejected"
              ? marketTrendResult.reason?.message || "Failed"
              : null,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Property Page Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to build property page data",
      },
      { status: 500 }
    );
  }
}
