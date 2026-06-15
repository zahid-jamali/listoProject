import { NextResponse } from "next/server";

export const LISTO_BASE_URL = "https://listo.ca";

export const DEFAULT_HEADERS = {
  Referer: `${LISTO_BASE_URL}/`,
  Origin: LISTO_BASE_URL,
  Accept: "application/json",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
};

function normalizeOrder(value, fallback = "desc") {
  const order = String(value || fallback).toLowerCase();
  return order === "asc" ? "asc" : "desc";
}

function normalizeSort(value, allowedSorts = [], fallback = null) {
  if (!value) return fallback;
  return allowedSorts.includes(value) ? value : fallback;
}

export function buildListoUrl(path, params = {}) {
  const upstream = new URL(`${LISTO_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      upstream.searchParams.set(key, String(value));
    }
  });

  return upstream;
}

export function buildForwardHeaders(req, extraHeaders = {}) {
  const headers = { ...DEFAULT_HEADERS, ...extraHeaders };

  const authHeader = req?.headers?.get("authorization");
  if (authHeader) headers.Authorization = authHeader;

  const cookieHeader = req?.headers?.get("cookie");
  if (cookieHeader) headers.Cookie = cookieHeader;

  return headers;
}

function applyParamAliases(searchParams, aliases = {}) {
  Object.entries(aliases).forEach(([from, to]) => {
    const value = searchParams.get(from);
    if (value !== null && value !== "") {
      searchParams.set(to, value);
    }
  });
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
      searchParams.get("limit") || defaultLimit,
    );
  }

  if (!omitOffset) {
    upstream.searchParams.set(
      "offset",
      searchParams.get("offset") || defaultOffset,
    );
  }

  if (!omitInclTotal) {
    upstream.searchParams.set(
      "incl_total",
      searchParams.get("incl_total") || defaultInclTotal,
    );
  }

  if (!omitSort && defaultSort) {
    const sort = normalizeSort(
      searchParams.get("sort"),
      allowedSorts,
      defaultSort,
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

function applyAllowedParams(upstream, searchParams, allowedParams = []) {
  allowedParams.forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null && value !== "") {
      upstream.searchParams.set(key, value);
    }
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
  requiredParams,
) {
  return requiredParams.filter((key) => {
    if (searchParams.get(key)) return false;
    if (defaultParams?.[key] !== undefined) return false;
    if (lockedParams?.[key] !== undefined) return false;
    return true;
  });
}

export function passthroughResponse(res, text) {
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });
}

export async function fetchListo(path, params = {}, init = {}) {
  const { req, headers: extraHeaders, method = "GET", body } = init;
  const upstream = buildListoUrl(path, params);

  const res = await fetch(upstream.toString(), {
    method,
    headers: buildForwardHeaders(req, extraHeaders),
    body,
    cache: "no-store",
  });

  const text = await res.text();
  return { res, text, upstream };
}

export async function fetchListoJson(path, params = {}, init = {}) {
  const { res, text } = await fetchListo(path, params, init);

  if (!res.ok) {
    throw new Error(text || `Listo request failed: ${res.status}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function proxyListoGet(req, options) {
  const {
    upstreamPath,
    allowedParams = null,
    paramAliases = {},
    defaultParams = {},
    lockedParams = {},
    requiredParams = [],
    extraExcludedParams = [],
    errorMessage = "Failed to fetch upstream data",
    ...listOptions
  } = options;

  try {
    const { searchParams } = new URL(req.url);
    applyParamAliases(searchParams, paramAliases);

    const missingRequired = getMissingRequired(
      searchParams,
      defaultParams,
      lockedParams,
      requiredParams,
    );

    if (missingRequired.length) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required params: ${missingRequired.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const upstream = new URL(`${LISTO_BASE_URL}${upstreamPath}`);

    if (allowedParams) {
      applyAllowedParams(upstream, searchParams, allowedParams);
      applyDefaultParams(upstream, searchParams, defaultParams);
    } else {
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
        ...Object.keys(paramAliases),
        ...extraExcludedParams,
      ];

      forwardRemainingParams(upstream, searchParams, excluded);
    }

    const res = await fetch(upstream.toString(), {
      method: "GET",
      headers: buildForwardHeaders(req),
      cache: "no-store",
    });

    const text = await res.text();
    return passthroughResponse(res, text);
  } catch (error) {
    console.error(`Listo proxy failed for ${upstreamPath}:`, error);

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        upstreamPath,
      },
      { status: 500 },
    );
  }
}
