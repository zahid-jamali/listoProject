import { proxyListoGet } from "@/lib/listo-proxy";

/**
 * Params forwarded to the legacy `/api/listings`
 * (listingController.get_listings_combined -> treb.get_search_query).
 * Location filtering uses loc_type (AREA|MUNC|COMM) + search_text (slug).
 */
const ALLOWED_PARAMS = [
  "type",
  "limit",
  "offset",
  "page",
  "sort",
  "order",
  "incl_total",
  "status",
  "out",
  // Location
  "loc_type",
  "search_text",
  "area_slug",
  "munc_slug",
  "comm_slug",
  "city",
  "city_slug",
  // Filters
  "s_r",
  "sub_type",
  "sub_type2",
  "pr_min",
  "pr_max",
  "br_min",
  "bath_min",
  "min_park_spcs",
  "min_gar_spaces",
  "viewport",
  // Legacy-friendly aliases (kept for backwards compat)
  "min_price",
  "max_price",
  "beds",
  "baths",
  "property_type",
  "search",
];

/**
 * Friendly -> upstream param names so the UI can send readable filters.
 */
const PARAM_ALIASES = {
  min_price: "pr_min",
  max_price: "pr_max",
  beds: "br_min",
  baths: "bath_min",
  property_type: "sub_type2",
};

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/listings",
    allowedParams: ALLOWED_PARAMS,
    paramAliases: PARAM_ALIASES,
    defaultParams: {
      type: "RS",
      limit: "12",
      incl_total: "1",
      // Legacy map / browse tables default: data-sort-name="ld" data-sort-order="desc"
      sort: "ld",
      order: "desc",
    },
    errorMessage: "Failed to fetch listings",
  });
}
