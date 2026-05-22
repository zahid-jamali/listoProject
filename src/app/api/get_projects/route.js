// src/app/api/projects/route.js

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Current request URL
    const { searchParams } = new URL(req.url);

    // Original API
    const upstream = new URL("https://listo.ca/api/get_projects");

    /**
     * Supported Query Params
     *
     * type
     * area_slug
     * developer_name
     * status
     * country
     * search
     * attributes[]
     * limit
     * offset
     * sort
     * order
     */

    // Optional filters
    const allowedParams = [
      "type",
      "area_slug",
      "developer_name",
      "status",
      "country",
      "search",
    ];

    allowedParams.forEach((param) => {
      const value = searchParams.get(param);

      if (value) {
        upstream.searchParams.set(param, value);
      }
    });

    const attributes = searchParams.getAll("attributes[]");

    if (attributes.length > 0) {
      attributes.forEach((attr) => {
        upstream.searchParams.append("attributes[]", attr);
      });
    }

    // Include total count
    // upstream.searchParams.set("incl_total", "1");

    // Fetch from original API
    console.log(`URL: ${upstream.toString()}`);
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

    // Get raw response
    const text = await res.text();

    // Return same response
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
