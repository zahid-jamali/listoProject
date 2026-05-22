// src/app/api/get_inv_listings/route.js

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // frontend se aa raha hoga
    // ?search=toronto

    const city = searchParams.get("search") || "toronto";

    // LISTO API
    const apiUrl = `https://listo.ca/api/get_inv_listings?munc_slug=${city}&incl_total=1&limit=12&offset=0`;

    const response = await fetch(apiUrl, {
      headers: {
        Referer: "https://listo.ca/",
        Origin: "https://listo.ca",
        "User-Agent": "Mozilla/5.0 Next.js API Proxy",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
