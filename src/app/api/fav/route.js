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

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, type, brd } = body;

    if (!id || !type) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: id and type are required.",
        },
        { status: 400 },
      );
    }

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

    const headers = buildForwardHeaders(req, {
      "Content-Type": "application/json",
    });

    const response = await fetch(`${API_BASE_URL}/api/fav`, {
      method: "POST",
      headers,
      body: JSON.stringify({ id, type, brd }),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("POST fav Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add user bookmark",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id, type, brd } = body;

    if (!id || !type) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: id and type are required.",
        },
        { status: 400 },
      );
    }

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

    const headers = buildForwardHeaders(req, {
      "Content-Type": "application/json",
    });

    const response = await fetch(`${API_BASE_URL}/api/fav`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ id, type, brd }),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("DELETE fav Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove user bookmark",
      },
      { status: 500 },
    );
  }
}
