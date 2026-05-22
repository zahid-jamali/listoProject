import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const upstream = new URL("https://listo.ca/api/popular_buildings");

    /**
     * Supported params
     *
     * area_slug
     * search
     * limit
     * offset
     * sort
     * order
     * incl_total
     */

    const allowedParams = [
      "area_slug",
      "search",
      "limit",
      "offset",
      "sort",
      "order",
      "incl_total",
    ];

    allowedParams.forEach((param) => {
      const value = searchParams.get(param);

      if (value) {
        upstream.searchParams.set(param, value);
      }
    });

    // defaults
    if (!upstream.searchParams.get("limit")) {
      upstream.searchParams.set("limit", "24");
    }

    if (!upstream.searchParams.get("offset")) {
      upstream.searchParams.set("offset", "0");
    }

    if (!upstream.searchParams.get("incl_total")) {
      upstream.searchParams.set("incl_total", "1");
    }

    const res = await fetch(upstream.toString(), {
      method: "GET",
      headers: {
        Referer: "https://listo.ca/",
        Origin: "https://listo.ca",
        Accept: "application/json",
        "User-Agent": "Next.js Proxy",
      },
      cache: "no-store",
    });

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch buildings",
      },
      {
        status: 500,
      }
    );
  }
}
