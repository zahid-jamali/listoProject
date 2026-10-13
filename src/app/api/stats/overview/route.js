import { NextResponse } from "next/server";
import {
  buildForwardHeaders,
  LISTO_BASE_URL,
} from "@/lib/listo-proxy";
import { parseStatsSlug, locQuery } from "@/lib/stats-location";

async function fetchJson(path, req) {
  try {
    const res = await fetch(`${LISTO_BASE_URL}${path}`, {
      headers: buildForwardHeaders(req),
      cache: "no-store",
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

function asRows(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.rows)) return data.rows;
  return [];
}

/**
 * Composite market-stats payload for a location slug.
 * Aggregates the legacy BI endpoints the redesigned stats page needs.
 *
 * GET /api/stats/overview?slug=toronto
 * GET /api/stats/overview?slug=peel--brampton
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "toronto";
    const subType =
      searchParams.get("sub_type") || "ResidentialProperty";

    const loc = parseStatsSlug(slug);
    const base = locQuery(loc);

    const listingLoc =
      loc.location_type === "AREA"
        ? `loc_type=AREA&search_text=${encodeURIComponent(loc.area_slug)}`
        : loc.location_type === "COMM"
          ? `loc_type=COMM&search_text=${encodeURIComponent(loc.comm_slug)}`
          : `loc_type=MUNC&search_text=${encodeURIComponent(loc.munc_slug)}`;

    const searchName =
      loc.location_type === "COMM"
        ? loc.comm_slug
        : loc.location_type === "AREA"
          ? loc.area_slug
          : loc.munc_slug;

    const [
      pulse,
      soldSale,
      soldCondo,
      soldLeaseCondo,
      homeTrends,
      listingSummarySale,
      listingSummaryLease,
      soldTrends,
      saleCount,
      leaseCount,
      pcCount,
      insights,
    ] = await Promise.all([
      fetchJson(`/api/v1/get_market_pulse?${base}&sub_type=${subType}`, req),
      fetchJson(
        `/api/get_sold_summary?${base}&sub_type=${subType}&s_r=Sale&limit=12`,
        req,
      ),
      fetchJson(
        `/api/get_sold_summary?${base}&sub_type=CondoProperty&s_r=Sale&limit=6`,
        req,
      ),
      fetchJson(
        `/api/get_sold_summary?${base}&sub_type=CondoProperty&s_r=Lease&limit=6`,
        req,
      ),
      fetchJson(`/api/get_sold_trends_home_type_level?${base}`, req),
      fetchJson(
        `/api/monthly_listing_summary/?loc_type=${loc.location_type === "AREA" ? "AREA" : "MUNC"}&search=${encodeURIComponent(searchName)}&sub_type=${subType}&s_r=Sale&limit=8&sort=date&order=desc`,
        req,
      ),
      fetchJson(
        `/api/monthly_listing_summary/?loc_type=${loc.location_type === "AREA" ? "AREA" : "MUNC"}&search=${encodeURIComponent(searchName)}&sub_type=${subType}&s_r=Lease&limit=4&sort=date&order=desc`,
        req,
      ),
      fetchJson(
        `/api/monthly_sold_trends/?loc_type=${loc.location_type === "AREA" ? "AREA" : "MUNC"}&search=${encodeURIComponent(searchName)}&sub_type=${subType}&limit=12&sort=date&order=desc`,
        req,
      ),
      fetchJson(
        `/api/listings?type=RS&${listingLoc}&s_r=Sale&limit=1&incl_total=1`,
        req,
      ),
      fetchJson(
        `/api/listings?type=RS&${listingLoc}&s_r=Lease&limit=1&incl_total=1`,
        req,
      ),
      fetchJson(
        `/api/get_projects?type=PC&area_slug=${encodeURIComponent(loc.area_slug)}&limit=1&incl_total=1`,
        req,
      ),
      fetchJson(
        `/api/monthly_listing_summary/?loc_type=COMM&search=${encodeURIComponent(searchName)}&sub_type=${subType}&s_r=Sale&limit=12&sort=date&order=desc`,
        req,
      ),
    ]);

    // Optional home-type active counts for the pie (best-effort)
    const [resCount, cndCount] = await Promise.all([
      fetchJson(
        `/api/listings?type=RS&${listingLoc}&s_r=Sale&sub_type=RES&limit=1&incl_total=1`,
        req,
      ),
      fetchJson(
        `/api/listings?type=RS&${listingLoc}&s_r=Sale&sub_type=CND&limit=1&incl_total=1`,
        req,
      ),
    ]);

    const soldSaleRows = asRows(soldSale);
    const soldCondoRows = asRows(soldCondo);
    const listingSaleRows = asRows(listingSummarySale);
    const listingLeaseRows = asRows(listingSummaryLease);
    const soldTrendRows = asRows(soldTrends);
    const insightRows = asRows(insights);
    const homeTypeRows = asRows(homeTrends);

    return NextResponse.json({
      success: true,
      location: loc,
      pulse: pulse || null,
      sold: {
        sale: soldSaleRows,
        condo: soldCondoRows,
        leaseCondo: asRows(soldLeaseCondo),
      },
      homeTypes: homeTypeRows,
      listingSummary: {
        sale: listingSaleRows,
        lease: listingLeaseRows,
      },
      soldTrends: soldTrendRows,
      communityInsights: insightRows.filter(
        (r) => r.comm_slug || r.munc_slug !== searchName,
      ),
      counts: {
        forSale: Number(saleCount?.total || 0),
        forLease: Number(leaseCount?.total || 0),
        preConstruction: Number(pcCount?.total || 0),
        homes: Number(resCount?.total || 0),
        condos: Number(cndCount?.total || 0),
      },
    });
  } catch (error) {
    console.error("stats overview failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load market stats" },
      { status: 500 },
    );
  }
}
