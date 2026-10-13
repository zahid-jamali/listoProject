import { NextResponse } from "next/server";
import {
  buildForwardHeaders,
  LISTO_BASE_URL,
} from "@/lib/listo-proxy";

function unslug(slug = "") {
  return String(slug).replace(/-/g, " ").trim();
}

async function fetchJson(path, req) {
  const res = await fetch(`${LISTO_BASE_URL}${path}`, {
    headers: buildForwardHeaders(req),
    cache: "no-store",
  });
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text) };
  } catch {
    return { ok: false, status: res.status, data: null, text };
  }
}

/**
 * Resolve a building summary from popular_buildings (stable), then attempt
 * unit listings via getAddrListings.
 *
 * Note: legacy getAddrListings mutates a shared cols array when incl_total=1,
 * which can poison the upstream process. We never send incl_total here.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const addr_slug = searchParams.get("addr_slug");
    const s_r = searchParams.get("s_r") || "Sale";
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";

    if (!addr_slug) {
      return NextResponse.json(
        { success: false, message: "Missing required params: addr_slug" },
        { status: 400 },
      );
    }

    // 1) Summary from popular_buildings (search by humanized address)
    const search = encodeURIComponent(unslug(addr_slug));
    const summaryRes = await fetchJson(
      `/api/popular_buildings?search=${search}&limit=30&incl_total=0`,
      req,
    );

    let summary = null;
    const rows = summaryRes.data?.rows || summaryRes.data || [];
    if (Array.isArray(rows)) {
      summary =
        rows.find((r) => r.addr_slug === addr_slug) ||
        rows.find((r) =>
          String(r.addr_slug || "").includes(addr_slug),
        ) ||
        null;
    }

    // 2) Active unit listings — never pass incl_total (legacy bug)
    const listingQs = new URLSearchParams({
      addr_slug,
      type: "RS",
      addr_type: "building",
      sub_type: "CondoProperty",
      s_r,
      limit,
      offset,
      sort: "lp_dol",
      order: "desc",
    });

    const listingsRes = await fetchJson(
      `/api/getAddrListings?${listingQs}`,
      req,
    );

    let listingRows = [];
    let listingsOk = false;
    if (
      listingsRes.ok &&
      listingsRes.data &&
      !listingsRes.data.message &&
      Array.isArray(listingsRes.data.rows)
    ) {
      listingRows = listingsRes.data.rows;
      listingsOk = true;
      // Prefer summary bundled with listings when available
      if (listingsRes.data.summary) {
        summary = { ...summary, ...listingsRes.data.summary };
      }
    }

    if (!summary && listingRows[0]) {
      summary = {
        addr_slug,
        addr: listingRows[0].addr,
        title: listingRows[0].addr,
        munc_slug: listingRows[0].municipality
          ?.toLowerCase()
          ?.replace(/\s+/g, "-"),
        county: "on",
        count_total: listingRows.length,
        count_sale: s_r === "Sale" ? listingRows.length : 0,
        count_lease: s_r === "Lease" ? listingRows.length : 0,
        thumbnail: listingRows[0].thumbnail,
      };
    }

    if (!summary) {
      return NextResponse.json(
        {
          success: false,
          message: "Building not found",
          addr_slug,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      summary,
      rows: listingRows,
      total: listingsOk
        ? Number(listingsRes.data?.total || listingRows.length)
        : Number(
            s_r === "Lease"
              ? summary.count_lease || 0
              : summary.count_sale || 0,
          ),
      listings_available: listingsOk,
    });
  } catch (error) {
    console.error("Building proxy failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch building data" },
      { status: 500 },
    );
  }
}
