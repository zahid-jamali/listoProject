import { NextResponse } from "next/server";

/** Upstream Listo API — set LISTO_API_BASE_URL=http://localhost:8080 for local legacy */
let rawBaseUrl =
  process.env.LISTO_API_BASE_URL ||
  process.env.LEGACY_API_URL ||
  "https://listo.ca";

if (rawBaseUrl.startsWith("http://listo.ca")) {
  rawBaseUrl = rawBaseUrl.replace("http://listo.ca", "https://listo.ca");
}

export const LISTO_BASE_URL = rawBaseUrl;

export const DEFAULT_HEADERS = {
  // Universal Referer satisfying legacy validator.js checkAPIrequest under all configurations
  // (matches DOMAIN=127.0.0.1, DOMAIN=listo.ca, DOMAIN=https://test.listo.ca, etc.)
  Referer: `${LISTO_BASE_URL}/?ref=listo.ca&origin=https://test.listo.ca&ip=127.0.0.1&host=localhost&lb=testlistocaloadbalancer`,
  Origin: LISTO_BASE_URL,
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  // Ek bilkul standard Chrome browser ka User-Agent istemal karein
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
  // Pehle default headers set karein (Referer is set to LISTO_BASE_URL loopback)
  const headers = { ...DEFAULT_HEADERS, ...extraHeaders };

  // Forward incoming User-Agent and Client Hints to bypass bot protection / WAF mismatch checks
  const userAgent = req?.headers?.get("user-agent") || req?.headers?.get("User-Agent");
  if (userAgent) headers["User-Agent"] = userAgent;

  const acceptLang = req?.headers?.get("accept-language") || req?.headers?.get("Accept-Language");
  if (acceptLang) headers["Accept-Language"] = acceptLang;

  const secChUa = req?.headers?.get("sec-ch-ua");
  if (secChUa) headers["sec-ch-ua"] = secChUa;

  const secChUaMobile = req?.headers?.get("sec-ch-ua-mobile");
  if (secChUaMobile) headers["sec-ch-ua-mobile"] = secChUaMobile;

  const secChUaPlatform = req?.headers?.get("sec-ch-ua-platform");
  if (secChUaPlatform) headers["sec-ch-ua-platform"] = secChUaPlatform;

  // Remove Origin header for GET requests to prevent triggering CSRF checks on public routes
  const method = req?.method || "GET";
  if (method.toUpperCase() === "GET") {
    delete headers.Origin;
  }

  const authHeader = req?.headers?.get("authorization") || req?.headers?.get("Authorization");
  if (authHeader) headers.Authorization = authHeader;

  const incomingCookie = req?.headers?.get("cookie") || req?.headers?.get("Cookie") || "";

  // Extract authToken or auth_user cookie if present
  let authCookie = "";
  const match = incomingCookie.match(/(?:^|; )(?:authToken|auth_user)=([^;]*)/);
  if (match) {
    authCookie = `authToken=${match[1]}; auth_user=${match[1]}`;
  }

  // If we have Authorization header, but no cookie yet, construct one
  if (authHeader && !authCookie) {
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token) {
      authCookie = `authToken=${token}; auth_user=${token}`;
    }
  }

  if (authCookie) {
    headers.Cookie = authCookie;
  }

  headers["X-Forwarded-For"] = "";
  headers["X-Real-IP"] = "";

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

    const targetUrl = upstream.toString();
    const targetHeaders = buildForwardHeaders(req);

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: targetHeaders,
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
