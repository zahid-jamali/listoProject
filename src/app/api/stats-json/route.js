import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/stats_in_json",
    omitSort: true,
    omitOffset: true,
    omitLimit: true,
    omitInclTotal: true,
  });
}
