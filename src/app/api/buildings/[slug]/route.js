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

export async function GET(req, context) {
  const { slug } = await context.params;

  return proxyListoGet(req, {
    upstreamPath: "/api/getAddrListings",
    lockedParams: {
      addr_slug: slug,
      type: "RS",
      addr_type: "building",
      sub_type: "CondoProperty",
    },
    defaultParams: {
      s_r: "Sale",
      incl_total: "1",
      limit: "12",
      offset: "0",
    },
    allowedSorts: ALLOWED_SORTS,
    errorMessage: "Failed to fetch building listings",
  });
}
