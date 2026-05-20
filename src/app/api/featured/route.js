import { proxyListoGet } from "../../../lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/get_featured",
    omitSort: true,
    omitOffset: true,
    defaultLimit: "20",
  });
}
