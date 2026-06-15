import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/get_building_sold_monthly",
    requiredParams: ["addr"],
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
