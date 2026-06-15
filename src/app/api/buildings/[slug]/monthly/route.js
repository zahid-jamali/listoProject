import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req, context) {
  const { slug } = await context.params;

  return proxyListoGet(req, {
    upstreamPath: `/api/buildings/${slug}/monthly`,
    omitLimit: true,
    omitOffset: true,
    omitInclTotal: true,
    omitSort: true,
    errorMessage: "Failed to fetch building monthly data",
  });
}
