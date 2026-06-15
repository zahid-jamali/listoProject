import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/picklist_popular_buildings",
    omitLimit: true,
    omitOffset: true,
    omitInclTotal: true,
    omitSort: true,
  });
}
