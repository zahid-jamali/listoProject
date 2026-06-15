import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/get_stats_by_days",
    omitSort: true,
    omitOffset: true,
    omitLimit: true,
    omitInclTotal: true,
  });
}
