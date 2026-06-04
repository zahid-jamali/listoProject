import { proxyListoGet } from "../../../lib/listo-buildings-proxy";

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
    },
    allowedSorts: ALLOWED_SORTS,
    defaultSort: "lp_dol",
    defaultOrder: "desc",
    defaultLimit: "20",
    defaultOffset: "0",
    defaultInclTotal: "1",
  });
}
