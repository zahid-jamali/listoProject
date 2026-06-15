import { proxyListoGet } from "@/lib/listo-proxy";

const ALLOWED_SORTS = [
  "id",
  "title",
  "addr",
  "developer_name",
  "sale_start_date",
  "occ_date",
  "lp_dol",
  "type",
  "status",
  "area_slug",
  "community",
  "municipality",
];

export async function GET(req) {
  return proxyListoGet(req, {
    upstreamPath: "/api/get_projects",
    allowedSorts: ALLOWED_SORTS,
    defaultSort: "id",
    defaultOrder: "desc",
    defaultLimit: "12",
  });
}
