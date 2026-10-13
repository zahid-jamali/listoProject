import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/monthly_listings_insights/",
    omitSort: true,
    omitOffset: true,
    omitInclTotal: true,
    defaultLimit: "12",
  });
}
