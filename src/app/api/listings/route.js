import { proxyListoGet } from "@/lib/listo-proxy";

const ALLOWED_PARAMS = [
  "type",
  "limit",
  "page",
  "sort",
  "city",
  "city_slug",
  "viewport",
  "min_price",
  "max_price",
  "beds",
  "baths",
  "property_type",
  "search",
];

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/listings",
    allowedParams: ALLOWED_PARAMS,
    defaultParams: {
      type: "RS",
      limit: "12",
    },
    errorMessage: "Failed to fetch listings",
  });
}
