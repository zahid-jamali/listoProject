import { proxyListoGet } from "../../../lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/main_search/",
    omitSort: true,
    omitOffset: true,
    defaultLimit: "10",
    defaultInclTotal: "0",
  });
}
