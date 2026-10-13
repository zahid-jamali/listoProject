import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/get_stats_by_days",
    defaultParams: {
      munc_slug: "toronto",
      type: "RS",
    },
    omitSort: true,
    omitOffset: true,
    omitLimit: true,
    omitInclTotal: true,
  });
}
