// src/app/api/projects/route.js

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const upstream = new URL("https://listo.ca/api/get_projects");

    const allowedParams = [
      "type",
      "area_slug",
      "developer_name",
      "status",
      "country",
      "search",
      "limit",
      "offset",
      "sort",
      "order",
    ];

    allowedParams.forEach((param) => {
      const value = searchParams.get(param);

      if (value !== null && value !== undefined && value !== "") {
        upstream.searchParams.set(param, value);
      }
    });

    console.log(`Projects API URL: ${upstream.toString()}`);

    const res = await fetch(upstream.toString(), {
      method: "GET",
      headers: {
        Referer: "https://listo.ca/",
        Origin: "https://listo.ca",
        "User-Agent": "Mozilla/5.0 Next.js API Proxy",
        Accept: "application/json",
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
    console.error("Projects API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch projects",
      },
      {
        status: 500,
      }
    );
  }
}
