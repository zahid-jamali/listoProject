import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const params = await context.params;
    const { searchParams } = new URL(req.url);

    const upstream = new URL("https://listo.ca/api/get_addr_comp_stats");

    upstream.searchParams.set("addr_slug", params.slug);

    upstream.searchParams.set("s_r", searchParams.get("s_r") || "Sale");

    const res = await fetch(upstream.toString(), {
      headers: {
        Referer: "https://listo.ca/",
        Origin: "https://listo.ca",
      },
      cache: "no-store",
    });

    return NextResponse.json(await res.json());
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
