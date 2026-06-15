import { proxyListoGet } from "@/lib/listo-proxy";

const ALLOWED_SORTS = [
  "lp_dol",
  "dom_calc",
  "br",
  "bath_tot",
  "sqft",
  "maint",
  "addr",
  "apt_num",
];

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/getAddrListings",
    requiredParams: ["addr_slug"],
    lockedParams: {
      type: "RS",
      addr_type: "building",
      sub_type: "CondoProperty",
    },
    defaultParams: {
      s_r: "Sale",
      incl_total: "1",
      limit: "20",
      offset: "0",
    },
    allowedSorts: ALLOWED_SORTS,
    defaultSort: "lp_dol",
    defaultOrder: "desc",
  });
}
