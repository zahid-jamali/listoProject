import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://listo.ca/api/picklist_popular_buildings", {
      headers: {
        Referer: "https://listo.ca/",
        Origin: "https://listo.ca",
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
