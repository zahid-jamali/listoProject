/**
 * Building SEO URL helpers.
 *
 * Legacy canonical detail path:
 *   /condo-building/:area_slug/:munc_slug/:addr_slug/:title?
 */

export function getBuildingUrl(building) {
  if (building?.access_url && String(building.access_url).startsWith("/condo-building/")) {
    return String(building.access_url).replace(/\/+$/, "");
  }

  const area = building?.area_slug || "ontario";
  const munc = building?.munc_slug || area;
  const addr = building?.addr_slug;
  if (!addr) return "/top-condo-buildings-in-ontario";

  const title = building?.title
    ? String(building.title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";

  const base = `/condo-building/${area}/${munc}/${addr}`;
  return title && title !== addr ? `${base}/${title}` : base;
}

export function stashBuilding(building) {
  if (typeof window === "undefined" || !building) return;
  try {
    const json = JSON.stringify(building);
    sessionStorage.setItem("building", json);
    const slug = building.addr_slug;
    if (slug) sessionStorage.setItem(`building:${slug}`, json);
  } catch {
    /* ignore */
  }
}

export function readStashedBuilding(slug) {
  if (typeof window === "undefined") return null;
  try {
    if (slug) {
      const scoped = sessionStorage.getItem(`building:${slug}`);
      if (scoped) return JSON.parse(scoped);
    }
    const generic = sessionStorage.getItem("building");
    return generic ? JSON.parse(generic) : null;
  } catch {
    return null;
  }
}

/** Parse /condo-building/:area/:munc/:addr/:title? → { area_slug, munc_slug, addr_slug } */
export function parseBuildingPath(pathname = "") {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "condo-building" || parts.length < 4) return null;
  return {
    area_slug: parts[1],
    munc_slug: parts[2],
    addr_slug: parts[3],
    title: parts[4] || "",
  };
}
