import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || "";
    const s_r = searchParams.get("s_r") || "";

    if (q.trim().length < 2) {
      return NextResponse.json([]);
    }

    const upstream = new URL("https://listo.ca/api/main_search/");
    upstream.searchParams.set("q", q);

    if (s_r) {
      upstream.searchParams.set("s_r", s_r);
    }

    const res = await fetch(upstream.toString(), {
      method: "GET",
      headers: {
        Referer: "https://listo.ca/",
        Origin: "https://listo.ca",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 Next.js Search Proxy",
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
    console.error("Main Search Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch search results",
      },
      { status: 500 }
    );
  }
}
