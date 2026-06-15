import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/get_sold_monthly_chart_series",
    omitSort: true,
    omitOffset: true,
    omitInclTotal: true,
    defaultLimit: "12",
  });
}
