import { proxyListoGet } from "@/lib/listo-proxy";

/**
 * Popular buildings directory.
 * Legacy: GET /api/popular_buildings?area_slug=&search=&limit=&offset=
 */
export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/popular_buildings",
    allowedParams: [
      "area_slug",
      "search",
      "limit",
      "offset",
      "incl_total",
      "sort",
      "order",
    ],
    defaultParams: {
      limit: "24",
      offset: "0",
      incl_total: "1",
      sort: "count_total",
      order: "desc",
    },
    errorMessage: "Failed to fetch buildings",
  });
}
