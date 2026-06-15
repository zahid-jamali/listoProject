import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/get_addr_hist",
    requiredParams: ["addr_slug"],
    lockedParams: {
      addr_type: "building",
      sub_type: "CondoProperty",
    },
    defaultParams: {
      sort: "unavail_dt",
      limit: "30",
    },
    omitOffset: true,
    omitInclTotal: true,
    omitSort: true,
  });
}
