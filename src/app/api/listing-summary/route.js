import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/monthly_listing_summary/",
    omitSort: true,
    omitOffset: true,
    omitInclTotal: true,
    defaultLimit: "12",
  });
}
