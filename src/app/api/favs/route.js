import { NextResponse } from "next/server";
import { buildForwardHeaders, LISTO_BASE_URL as API_BASE_URL } from "@/lib/listo-proxy";

function getAuthHeader(req) {
  const authHeader =
    req.headers.get("Authorization") || req.headers.get("authorization");
  if (authHeader) {
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      return authHeader;
    }
    if (authHeader.toLowerCase().startsWith("bearer:")) {
      return `Bearer ${authHeader.slice(7).trim()}`;
    }
    return `Bearer ${authHeader.trim()}`;
  }
  return null;
}

function getCookieHeader(req) {
  return req.headers.get("Cookie") || req.headers.get("cookie");
}

export async function GET(req) {
  try {
    const authHeader = getAuthHeader(req);
    const cookieHeader = getCookieHeader(req);

    if (!authHeader && !cookieHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Missing authentication token or cookie.",
        },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const upstreamUrl = new URL(`${API_BASE_URL}/api/favs`);
    upstreamUrl.search = searchParams.toString();

    const headers = buildForwardHeaders(req);

    const response = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("GET favs Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user bookmarks",
      },
      { status: 500 },
    );
  }
}
