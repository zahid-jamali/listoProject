import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/get_sold_trends_home_type_level",
    omitSort: true,
    omitOffset: true,
    omitLimit: true,
    omitInclTotal: true,
  });
}
