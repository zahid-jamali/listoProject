/** Shared helpers for market-stats location resolution. */

export const AREA_EQ_MUNC = [
  "toronto",
  "hamilton",
  "kawartha-lakes",
  "brantford",
  "chatham-kent",
  "haldimand",
  "brant",
  "kenora",
  "norfolk",
  "ottawa",
  "rainy-river",
  "greater-sudbur",
  "thunder-bay",
];

export function titleize(slug = "") {
  return String(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Parse a stats URL slug into legacy location params.
 *
 * Examples:
 *   toronto              → AREA / toronto (area_eq_munc)
 *   peel--brampton       → MUNC / peel / brampton
 *   brampton             → MUNC / brampton / brampton
 */
export function parseStatsSlug(slug = "") {
  const clean = String(slug || "")
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
  const parts = clean.split("--").filter(Boolean);
  const area = parts[0] || "";
  const munc = parts[1] || "";
  const comm = parts[2] || "";

  if (!area) {
    return {
      location_type: "AREA",
      area_slug: "toronto",
      munc_slug: "toronto",
      label: "Toronto",
    };
  }

  if (AREA_EQ_MUNC.includes(area) && !comm) {
    return {
      location_type: "AREA",
      area_slug: area,
      munc_slug: area,
      label: titleize(area),
    };
  }

  if (comm) {
    return {
      location_type: "COMM",
      area_slug: area,
      munc_slug: munc || area,
      comm_slug: comm,
      label: titleize(comm),
    };
  }

  if (munc) {
    return {
      location_type: "MUNC",
      area_slug: area,
      munc_slug: munc,
      label: titleize(munc),
    };
  }

  // Single non-area_eq slug → treat as municipality
  return {
    location_type: "MUNC",
    area_slug: area,
    munc_slug: area,
    label: titleize(area),
  };
}

export function locQuery(loc) {
  const q = new URLSearchParams();
  q.set("location_type", loc.location_type);
  if (loc.area_slug) q.set("area_slug", loc.area_slug);
  if (loc.munc_slug) q.set("munc_slug", loc.munc_slug);
  if (loc.comm_slug) q.set("comm_slug", loc.comm_slug);
  return q;
}
