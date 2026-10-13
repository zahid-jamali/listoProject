import { NextResponse } from "next/server";
import { proxyListoGet } from "@/lib/listo-proxy";

/**
 * Proxy for legacy `/api/get_addr_hist` (auth_user).
 * Used by the listing page Sale/Lease History section with addr_type=single.
 */
export async function GET(req) {
  const authHeader =
    req.headers.get("Authorization") || req.headers.get("authorization");
  const cookieHeader =
    req.headers.get("Cookie") || req.headers.get("cookie");

  if (!authHeader && !cookieHeader) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  return proxyListoGet(req, {
    upstreamPath: "/api/get_addr_hist",
    defaultParams: {
      addr_type: "single",
      sort: "unavail_dt",
      limit: "30",
    },
    omitOffset: true,
    omitInclTotal: true,
    omitSort: true,
    errorMessage: "Failed to fetch listing sale/lease history",
  });
}
