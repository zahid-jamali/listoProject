import { NextResponse } from "next/server";

const ALLOWED_PARAMS = [
  "type",
  "limit",
  "page",
  "sort",
  "city",
  "city_slug",
  "viewport",
  "min_price",
  "max_price",
  "beds",
  "baths",
  "property_type",
  "search",
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const upstreamParams = new URLSearchParams();

    for (const key of ALLOWED_PARAMS) {
      const value = searchParams.get(key);

      if (value !== null && value !== "") {
        upstreamParams.set(key, value);
      }
    }

    // Default Featured Listings
    if (!upstreamParams.has("type")) {
      upstreamParams.set("type", "RS");
    }

    if (!upstreamParams.has("limit")) {
      upstreamParams.set("limit", "12");
    }

    const url = `https://listo.ca/api/listings?${upstreamParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        Referer: "https://listo.ca/",
        Origin: "https://listo.ca",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 Next.js Search Proxy",
      },
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Listings Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch listings",
      },
      {
        status: 500,
      },
    );
  }
}
