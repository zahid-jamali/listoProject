// import { useParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const params = await context.params;
    const { searchParams } = new URL(req.url);

    /**
     * Original API
     *
     * Example:
     * /api/getAddrListings?
     * type=RS&
     * addr_type=building&
     * sub_type=CondoProperty&
     * addr_slug=1185-dupont-street&
     * s_r=Sale&
     * incl_total=1
     */

    const upstream = new URL("https://listo.ca/api/getAddrListings");

    /**
     * Required params
     */

    upstream.searchParams.set("addr_slug", params.slug);

    upstream.searchParams.set("type", searchParams.get("type") || "RS");

    upstream.searchParams.set("s_r", searchParams.get("s_r") || "Sale");

    upstream.searchParams.set(
      "addr_type",
      searchParams.get("addr_type") || "building"
    );

    upstream.searchParams.set(
      "sub_type",
      searchParams.get("sub_type") || "CondoProperty"
    );

    upstream.searchParams.set(
      "incl_total",
      searchParams.get("incl_total") || "1"
    );

    /**
     * Pagination
     */

    upstream.searchParams.set("limit", searchParams.get("limit") || "12");

    upstream.searchParams.set("offset", searchParams.get("offset") || "0");

    /**
     * Sorting optional
     */

    if (searchParams.get("sort")) {
      upstream.searchParams.set("sort", searchParams.get("sort"));
    }

    if (searchParams.get("order")) {
      upstream.searchParams.set("order", searchParams.get("order"));
    }

    console.log("Building Listings API:", upstream.toString());

    const res = await fetch(upstream.toString(), {
      method: "GET",
      headers: {
        Referer: "https://listo.ca/",
        Origin: "https://listo.ca",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 Next.js Proxy",
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
    console.error("Building API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch building listings",
      },
      {
        status: 500,
      }
    );
  }
}
