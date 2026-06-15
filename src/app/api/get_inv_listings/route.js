import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/get_inv_listings",
    paramAliases: { search: "munc_slug" },
    defaultParams: {
      munc_slug: "toronto",
      incl_total: "1",
      limit: "12",
      offset: "0",
    },
    omitSort: true,
    extraExcludedParams: ["search"],
  });
}
