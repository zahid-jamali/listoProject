import { proxyListoGet } from "@/lib/listo-proxy";

/**
 * Markets picklist for the investors home page.
 * Legacy: GET /api/picklist_inv_listings
 * Response: [{ munc_slug, count }, ...]
 */
export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/picklist_inv_listings",
    omitLimit: true,
    omitOffset: true,
    omitInclTotal: true,
    omitSort: true,
    errorMessage: "Failed to fetch investor markets",
  });
}
