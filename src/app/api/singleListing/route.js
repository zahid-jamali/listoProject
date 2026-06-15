import { NextResponse } from "next/server";
import { buildListingPageData } from "@/lib/build-listing-page-data";

export async function POST(req) {
  try {
    const body = await req.json();
    const listing = body?.listing || body;
    const id = listing?.id || body?.id;
    const type = listing?.type || body?.type;

    if (!id || !type) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: id and type",
        },
        { status: 400 }
      );
    }

    const data = await buildListingPageData(body, req);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Single listing proxy error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch listing details",
      },
      { status: 500 }
    );
  }
}
