import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req, context) {
  const { slug } = await context.params;

  return proxyListoGet(req, {
    upstreamPath: "/api/get_addr_comp_stats",
    lockedParams: { addr_slug: slug },
    defaultParams: { s_r: "Sale" },
    omitLimit: true,
    omitOffset: true,
    omitInclTotal: true,
    omitSort: true,
    errorMessage: "Failed to fetch building stats",
  });
}
