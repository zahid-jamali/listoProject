import { proxyListoGet } from "@/lib/listo-proxy";

/**
 * Area picklist for the buildings directory filter.
 * Legacy: GET /api/picklist_popular_buildings
 * Response: [{ area_slug, count }, ...]
 */
export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/picklist_popular_buildings",
    omitLimit: true,
    omitOffset: true,
    omitInclTotal: true,
    omitSort: true,
    errorMessage: "Failed to fetch building areas",
  });
}
