import { proxyListoGet } from "../../../lib/listo-buildings-proxy";

const ALLOWED_SORTS = [
  "addr",
  "title",
  "area_slug",
  "munc_slug",
  "count_total",
  "count",
];

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/popular_buildings",
    allowedSorts: ALLOWED_SORTS,
    defaultSort: "addr",
    defaultOrder: "asc",
    defaultLimit: "24",
    defaultOffset: "0",
    defaultInclTotal: "1",
  });
}
