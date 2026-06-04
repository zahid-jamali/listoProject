import { NextResponse } from "next/server";

const DEFAULT_HEADERS = {
  Referer: "https://listo.ca/",
  Origin: "https://listo.ca",
  Accept: "application/json",
  "User-Agent": "Mozilla/5.0 Next.js Building Proxy",
};

function normalizeOrder(value, fallback = "desc") {
  const order = String(value || fallback).toLowerCase();
  return order === "asc" ? "asc" : "desc";
}

function normalizeSort(value, allowedSorts = [], fallback = null) {
  if (!value) return fallback;
  return allowedSorts.includes(value) ? value : fallback;
}

function buildForwardHeaders(req) {
  const headers = { ...DEFAULT_HEADERS };

  const authHeader = req.headers.get("authorization");
  if (authHeader) headers.Authorization = authHeader;

  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) headers.Cookie = cookieHeader;

  return headers;
}

function applyListParams(upstream, searchParams, options = {}) {
  const {
    defaultLimit = "20",
    defaultOffset = "0",
    defaultInclTotal = "1",
    defaultSort = null,
    defaultOrder = "desc",
    allowedSorts = [],
    omitLimit = false,
    omitOffset = false,
    omitInclTotal = false,
    omitSort = false,
  } = options;

  if (!omitLimit) {
    upstream.searchParams.set(
      "limit",
      searchParams.get("limit") || defaultLimit
    );
  }

  if (!omitOffset) {
    upstream.searchParams.set(
      "offset",
      searchParams.get("offset") || defaultOffset
    );
  }

  if (!omitInclTotal) {
    upstream.searchParams.set(
      "incl_total",
      searchParams.get("incl_total") || defaultInclTotal
    );
  }

  if (!omitSort && defaultSort) {
    const sort = normalizeSort(
      searchParams.get("sort"),
      allowedSorts,
      defaultSort
    );
    const order = normalizeOrder(searchParams.get("order"), defaultOrder);

    if (sort) upstream.searchParams.set("sort", sort);
    upstream.searchParams.set("order", order);
  }
}

function applyDefaultParams(upstream, searchParams, params = {}) {
  Object.entries(params).forEach(([key, value]) => {
    upstream.searchParams.set(key, searchParams.get(key) || String(value));
  });
}

function applyLockedParams(upstream, params = {}) {
  Object.entries(params).forEach(([key, value]) => {
    upstream.searchParams.set(key, String(value));
  });
}

function forwardRemainingParams(upstream, searchParams, excluded = []) {
  searchParams.forEach((value, key) => {
    if (!excluded.includes(key) && !upstream.searchParams.has(key)) {
      upstream.searchParams.set(key, value);
    }
  });
}

function getMissingRequired(
  searchParams,
  defaultParams,
  lockedParams,
  requiredParams
) {
  return requiredParams.filter((key) => {
    if (searchParams.get(key)) return false;
    if (defaultParams && defaultParams[key] !== undefined) return false;
    if (lockedParams && lockedParams[key] !== undefined) return false;
    return true;
  });
}

export async function proxyListoGet(req, options) {
  const {
    upstreamPath,
    defaultParams = {},
    lockedParams = {},
    requiredParams = [],
    extraExcludedParams = [],
    ...listOptions
  } = options;

  try {
    const { searchParams } = new URL(req.url);

    const missingRequired = getMissingRequired(
      searchParams,
      defaultParams,
      lockedParams,
      requiredParams
    );

    if (missingRequired.length) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required params: ${missingRequired.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const upstream = new URL(`https://listo.ca${upstreamPath}`);

    applyListParams(upstream, searchParams, listOptions);
    applyDefaultParams(upstream, searchParams, defaultParams);
    applyLockedParams(upstream, lockedParams);

    const excluded = [
      "limit",
      "offset",
      "incl_total",
      "sort",
      "order",
      ...Object.keys(defaultParams),
      ...Object.keys(lockedParams),
      ...extraExcludedParams,
    ];

    forwardRemainingParams(upstream, searchParams, excluded);

    const res = await fetch(upstream.toString(), {
      method: "GET",
      headers: buildForwardHeaders(req),
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
    console.error(`Listo building proxy failed for ${upstreamPath}:`, error);

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
