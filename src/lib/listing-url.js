import { encodeListingData } from "./url-helper";

/**
 * Legacy SEO URL helpers.
 *
 * The Listo backend stores a precomputed `access_url` column on every listing
 * and project row (e.g. `/house-for-sale/york-real-estate/N7037190/243-via-...`).
 * Those are the canonical, Google-indexed URLs on listo.ca, so we navigate to
 * them directly instead of the `?p=<base64>` blob URLs.
 *
 * To keep the UI instant on in-app navigation we stash the full object in
 * sessionStorage before navigating; the detail page reads it back. On a direct
 * visit / shared link / crawler the detail page falls back to fetching by id.
 */

export const LISTING_PREFIXES = [
  "house-for-sale",
  "condo-for-sale",
  "house-for-lease",
  "condo-for-lease",
  "commercial-property-for-sale",
  "commercial-property-for-lease",
];

const LISTING_STASH_PREFIX = "listing:";
const PROJECT_STASH_PREFIX = "project:";

export function isLegacyListingPath(url) {
  if (!url || typeof url !== "string") return false;
  const path = url.split("?")[0];
  return LISTING_PREFIXES.some((p) => path.startsWith(`/${p}/`));
}

/** Whether this listing is for rent (lease) or for sale. */
export function getListingOffer(listing) {
  const s_r = String(listing?.s_r || "").toLowerCase();
  const url = String(listing?.access_url || "").toLowerCase();
  const isRent =
    s_r === "lease" ||
    s_r === "rent" ||
    url.includes("-for-lease");

  return {
    kind: isRent ? "rent" : "sale",
    label: isRent ? "For Rent" : "For Sale",
  };
}

/** Resolve the canonical URL a listing card / link should point to. */
export function getListingUrl(listing) {
  if (isLegacyListingPath(listing?.access_url)) {
    return listing.access_url;
  }
  // Fallback (assignment/custom/exclusive or missing access_url): keep it working.
  return `/listings/ind?p=${encodeURIComponent(encodeListingData(listing))}`;
}

/** Store the full listing object so the detail page can hydrate instantly. */
export function stashListing(listing) {
  if (typeof window === "undefined" || !listing) return;
  try {
    const json = JSON.stringify(listing);
    sessionStorage.setItem("listing", json);
    const path = String(listing.access_url || "").split("?")[0];
    if (path) sessionStorage.setItem(LISTING_STASH_PREFIX + path, json);
  } catch {
    /* sessionStorage may be unavailable (private mode / quota) */
  }
}

/** Read back a stashed listing, preferring the one matching this exact path. */
export function readStashedListing(pathname) {
  if (typeof window === "undefined") return null;
  try {
    const key = String(pathname || "").split("?")[0];
    if (key) {
      const scoped = sessionStorage.getItem(LISTING_STASH_PREFIX + key);
      if (scoped) return JSON.parse(scoped);
    }
    const generic = sessionStorage.getItem("listing");
    return generic ? JSON.parse(generic) : null;
  } catch {
    return null;
  }
}

/**
 * Parse a legacy listing path into the identifiers needed to fetch it.
 * Pattern: /<prefix>/<area>-real-estate/<MLS_ID>/<addr-slug>
 * The MLS id lives in segment index 2 (legacy `req.params.v2`); board is TREB.
 */
export function parseListingPath(pathname) {
  if (!pathname) return null;
  const clean = pathname.split("?")[0].replace(/\/+$/, "");
  const parts = clean.split("/").filter(Boolean);
  const prefix = parts[0] || "";
  if (!LISTING_PREFIXES.includes(prefix)) return null;

  const areaSeg = parts[1] || "";
  const area_slug = areaSeg.replace(/-real-estate$/, "");
  const id = parts[2] || "";
  const s_r = prefix.includes("-for-lease") ? "Lease" : "Sale";

  let sub_type = "RES";
  if (prefix.startsWith("condo")) sub_type = "CND";
  else if (prefix.startsWith("commercial")) sub_type = "COM";

  return {
    id,
    type: "RS",
    brd: "TREB",
    s_r,
    sub_type,
    area_slug,
    access_url: clean,
  };
}

/* ─── Pre-construction projects ─────────────────────────────────────────── */

export function isLegacyProjectPath(url) {
  if (!url || typeof url !== "string") return false;
  const path = url.split("?")[0];
  return (
    path.startsWith("/pre-construction-condos-") ||
    /^\/pre-construction\/\d+\/\d+(\/|$)/.test(path)
  );
}

function slugify(value) {
  return String(value || "project")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Resolve the canonical URL a project card / link should point to. */
export function getProjectUrl(project) {
  if (isLegacyProjectPath(project?.access_url)) {
    return project.access_url;
  }
  const projectId = project?.project_id;
  const devId = project?.dv_id || project?.development_id || project?.id;
  if (projectId && devId) {
    // No trailing slash: Next.js (trailingSlash:false) would otherwise 308.
    return `/pre-construction/${projectId}/${devId}/${slugify(project?.title)}`;
  }
  return `/preconstruction/project?p=${encodeURIComponent(encodeListingData(project))}`;
}

export function stashProject(project) {
  if (typeof window === "undefined" || !project) return;
  try {
    const json = JSON.stringify(project);
    sessionStorage.setItem("PG", json);
    const path = String(project.access_url || "").split("?")[0];
    if (path) sessionStorage.setItem(PROJECT_STASH_PREFIX + path, json);
  } catch {
    /* ignore */
  }
}

export function readStashedProject(pathname) {
  if (typeof window === "undefined") return null;
  try {
    const key = String(pathname || "").split("?")[0];
    if (key) {
      const scoped = sessionStorage.getItem(PROJECT_STASH_PREFIX + key);
      if (scoped) return JSON.parse(scoped);
    }
    const generic = sessionStorage.getItem("PG");
    return generic ? JSON.parse(generic) : null;
  } catch {
    return null;
  }
}

/**
 * Parse a legacy project path.
 * Numeric:  /pre-construction/<project_id>/<development_id>/<name>/
 * Style2:   /pre-construction-condos-<area>/<title-slug>/
 */
export function parseProjectPath(pathname) {
  if (!pathname) return null;
  const clean = pathname.split("?")[0].replace(/\/+$/, "");
  const parts = clean.split("/").filter(Boolean);

  if (parts[0] === "pre-construction" && parts.length >= 3) {
    return {
      project_id: parts[1],
      dv_id: parts[2],
      development_id: parts[2],
      access_url: clean,
    };
  }

  if (parts[0] && parts[0].startsWith("pre-construction-condos-")) {
    return {
      area_slug: parts[0].replace(/^pre-construction-condos-/, ""),
      slug: parts[1] || "",
      access_url: clean,
    };
  }

  return null;
}
