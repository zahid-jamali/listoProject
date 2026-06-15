import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/get_building_sold_monthly_chart_series",
    requiredParams: ["addr_slug"],
    defaultParams: {
      type: "RS",
      s_r: "Sale",
    },
    omitLimit: true,
    omitOffset: true,
    omitInclTotal: true,
    omitSort: true,
  });
}
