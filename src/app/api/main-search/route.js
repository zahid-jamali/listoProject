import { NextResponse } from "next/server";
import { proxyListoGet } from "@/lib/listo-proxy";

export async function GET(req) {
  const q = new URL(req.url).searchParams.get("q") || "";

  if (q.trim().length < 2) {
    return NextResponse.json([]);
  }

  return proxyListoGet(req, {
    upstreamPath: "/api/main_search/",
    omitSort: true,
    omitOffset: true,
    omitLimit: true,
    omitInclTotal: true,
    errorMessage: "Failed to fetch search results",
  });
}
