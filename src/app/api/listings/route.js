import { proxyListoGet } from "../../../lib/listo-proxy";

const ALLOWED_SORTS = [
  "id",
  "lp_dol",
  "ld",
  "cd",
  "dom_calc",
  "br",
  "bath_tot",
  "sqft",
  "municipality",
  "community",
  "area",
];

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/listings",
    allowedSorts: ALLOWED_SORTS,
    defaultSort: "id",
    defaultOrder: "desc",
    defaultLimit: "20",
  });
}
