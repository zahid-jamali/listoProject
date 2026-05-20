import { proxyListoGet } from "../../../lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/get_models",
    omitSort: true,
    omitOffset: true,
    defaultLimit: "50",
  });
}
