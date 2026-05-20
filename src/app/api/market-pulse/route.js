import { proxyListoGet } from "../../../lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/v1/get_market_pulse",
    omitSort: true,
    omitOffset: true,
    defaultLimit: "10",
    defaultInclTotal: "0",
  });
}
