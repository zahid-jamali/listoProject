import { NextResponse } from "next/server";

const DEFAULT_HEADERS = {
  Referer: "https://listo.ca/",
  Origin: "https://listo.ca",
  Accept: "application/json",
  "User-Agent": "Mozilla/5.0 Next.js Proxy",
};

function normalizeOrder(value, fallback = "desc") {
  const order = (value || fallback).toLowerCase();
  return order === "asc" ? "asc" : "desc";
}

function normalizeSort(value, allowedSorts = [], fallback = null) {
  if (!fallback) return null;
  if (!value) return fallback;
  return allowedSorts.includes(value) ? value : fallback;
}

function applyCommonListParams(upstream, searchParams, options = {}) {
  const {
    defaultLimit = "10",
    defaultOffset = "0",
    defaultInclTotal = "1",
    allowedSorts = [],
    defaultSort = null,
    defaultOrder = "desc",
    omitSort = false,
    omitOffset = false,
  } = options;

  const limit = searchParams.get("limit") || defaultLimit;
  upstream.searchParams.set("limit", limit);

  if (!omitOffset) {
    const offset = searchParams.get("offset") || defaultOffset;
    upstream.searchParams.set("offset", offset);
  }

  const inclTotal = searchParams.get("incl_total") || defaultInclTotal;
  upstream.searchParams.set("incl_total", inclTotal);

  if (!omitSort && defaultSort) {
    const sort = normalizeSort(
      searchParams.get("sort"),
      allowedSorts,
      defaultSort
    );
    const order = normalizeOrder(searchParams.get("order"), defaultOrder);
    upstream.searchParams.set("sort", sort);
    upstream.searchParams.set("order", order);
  }
}

function forwardRemainingParams(upstream, searchParams, excluded = []) {
  searchParams.forEach((value, key) => {
    if (!excluded.includes(key) && !upstream.searchParams.has(key)) {
      upstream.searchParams.set(key, value);
    }
  });
}

export async function proxyListoGet(req, options) {
  const {
    upstreamPath,
    allowedSorts = [],
    defaultSort = null,
    defaultOrder = "desc",
    defaultLimit = "10",
    defaultOffset = "0",
    defaultInclTotal = "1",
    omitSort = false,
    omitOffset = false,
    extraExcludedParams = [],
  } = options;

  try {
    const { searchParams } = new URL(req.url);
    const upstream = new URL(`https://listo.ca${upstreamPath}`);

    applyCommonListParams(upstream, searchParams, {
      defaultLimit,
      defaultOffset,
      defaultInclTotal,
      allowedSorts,
      defaultSort,
      defaultOrder,
      omitSort,
      omitOffset,
    });

    const excluded = [
      "limit",
      "offset",
      "incl_total",
      "sort",
      "order",
      ...extraExcludedParams,
    ];

    forwardRemainingParams(upstream, searchParams, excluded);

    const res = await fetch(upstream.toString(), {
      method: "GET",
      headers: DEFAULT_HEADERS,
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
    console.error(`Listo proxy failed for ${options.upstreamPath}:`, error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch upstream data",
        upstreamPath,
      },
      { status: 500 }
    );
  }
}
