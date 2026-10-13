import { NextResponse } from "next/server";
import { proxyListoGet } from "@/lib/listo-proxy";

/**
 * Investor listings by municipality.
 * Legacy: GET /api/get_inv_listings?munc_slug=&limit=&offset=&incl_total=
 *
 * The UI may send `search` or `city` as aliases for `munc_slug`.
 *
 * Sort: legacy inv_active_listing_table has no data-sort-name, so upstream
 * receives no ORDER BY. Keep omitSort so natural MV order matches listo.ca.
 * Note: inv MV has no `ld` column — do not default sort=ld here.
 */
export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/get_inv_listings",
    paramAliases: {
      search: "munc_slug",
      city: "munc_slug",
    },
    defaultParams: {
      incl_total: "1",
      limit: "24",
      offset: "0",
    },
    omitSort: true,
    extraExcludedParams: ["search", "city"],
    errorMessage: "Failed to fetch investor listings",
  });
}
