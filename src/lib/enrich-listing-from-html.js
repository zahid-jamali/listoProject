import { buildForwardHeaders, LISTO_BASE_URL } from "@/lib/listo-proxy";

function stripTags(html = "") {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function getTabPaneChunk(html, paneId) {
  const marker = `id="${paneId}"`;
  const start = html.indexOf(marker);
  if (start < 0) return "";

  const from = html.slice(start);
  const nextPane = from
    .slice(marker.length)
    .search(/<div[^>]*class="[^"]*tab-pane/i);
  const end =
    nextPane >= 0
      ? marker.length + nextPane
      : Math.min(from.length, 12000);

  return from.slice(0, end);
}

function extractDlPairs(chunk) {
  const pairs = {};
  const re =
    /<dt[^>]*>\s*(?:<b>)?(?:<i[^>]*>[\s\S]*?<\/i>)?\s*([^:<]+):?\s*(?:<\/b>)?\s*<\/dt>\s*<dd[^>]*>\s*([\s\S]*?)\s*<\/dd>/gi;

  let match;
  while ((match = re.exec(chunk))) {
    const label = stripTags(match[1]).replace(/®/g, "").trim();
    const value = stripTags(match[2]);
    if (!label || pairs[label]) continue;
    pairs[label] = value;
  }

  return pairs;
}

function extractRooms(html) {
  const chunk = getTabPaneChunk(html, "contact");
  if (!chunk) return [];

  const rooms = [];
  const re = /<th>([^<]+)<\/th>\s*<td>([\s\S]*?)<\/td>/gi;
  let match;

  while ((match = re.exec(chunk))) {
    const name = stripTags(match[1]);
    const parts = String(match[2])
      .split(/<br\s*\/?>/i)
      .map((part) => stripTags(part))
      .filter(Boolean);

    if (!name) continue;

    const featuresRaw = parts[1] || "";
    rooms.push({
      description: name,
      dimensions: parts[0] || "",
      features: featuresRaw
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      featuresText: featuresRaw.replace(/\s+,/g, ",").trim(),
      level: (parts[2] || "").replace(/\s*Level$/i, "").trim(),
    });
  }

  return rooms;
}

function extractDescription(html) {
  const match = html.match(
    /class="desc_long"[^>]*>\s*<main>\s*<p[^>]*>([\s\S]*?)<\/p>\s*(?:<p[^>]*>([\s\S]*?)<\/p>)?/i,
  );

  if (!match) return { ad_text: "", extras: "" };

  return {
    ad_text: stripTags(match[1]),
    extras: stripTags(match[2] || ""),
  };
}

function extractWalkScore(html) {
  const start = html.search(/neighborhood-walkability|Transportation &amp; Walkability|Transportation & Walkability/i);
  if (start < 0) return null;

  const chunk = html.slice(start, start + 6000);

  const walkMatch = chunk.match(
    /itemprop="walkScore"[^>]*>\s*(\d+)\s*<\/span>[\s\S]*?<h6[^>]*>\s*(?:<i[^>]*><\/i>)?\s*([^<]+)\s*<\/h6>\s*<p[^>]*>\s*([^<]+)/i,
  );

  const transitMatch = chunk.match(
    /Transit Score[\s\S]*?<span class="h3[^"]*"[^>]*>\s*(\d+)\s*<\/span>[\s\S]*?<h6[^>]*>\s*(?:<i[^>]*><\/i>)?\s*([^<]+)\s*<\/h6>\s*<p[^>]*>\s*([^<]+)/i,
  );

  const bikeMatch = chunk.match(
    /Bike Score[\s\S]*?<span class="h3[^"]*"[^>]*>\s*(\d+)\s*<\/span>[\s\S]*?<h6[^>]*>\s*(?:<i[^>]*><\/i>)?\s*([^<]+)\s*<\/h6>\s*<p[^>]*>\s*([^<]+)/i,
  );

  const toScore = (match) => {
    if (!match) return null;
    const score = Number(match[1]);
    if (!Number.isFinite(score)) return null;
    return {
      score,
      category: stripTags(match[2]),
      description: stripTags(match[3]),
    };
  };

  const walk = toScore(walkMatch);
  if (!walk) return null;

  return {
    score: walk.score,
    category: walk.category,
    category_description: walk.description,
    transit: toScore(transitMatch),
    bike: toScore(bikeMatch),
  };
}

function extractNeighborhoodVibe(html) {
  const match = html.match(
    /Neighborhood Vibe[\s\S]*?<p[^>]*class="[^"]*mb-2[^"]*"[^>]*>\s*([\s\S]*?)\s*<\/p>/i,
  );
  if (!match) return null;
  const text = stripTags(match[1]);
  return text || null;
}

function extractEntityAi(html) {
  const match = html.match(/gv_entity_ai\s*=\s*(\{[\s\S]*?\});/);
  if (!match?.[1]) return null;

  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function normalizeRoomsFromEntity(entityRooms = []) {
  return (entityRooms || [])
    .map((room) => {
      const length = room.length ?? room.len ?? "";
      const width = room.width ?? "";
      const dimensions =
        length && width ? `${length} x ${width}m` : length || width || "";
      const features = [room.feature1, room.feature2, room.feature3].filter(
        Boolean,
      );

      return {
        description: room.description || room.name || "Room",
        dimensions,
        features,
        featuresText: features.join(", "),
        level: String(room.level || "").replace(/\s*Level$/i, "").trim(),
      };
    })
    .filter((room) => room.description);
}

/**
 * Legacy single-listing pages are SSR'd with full fields (ad_text, rooms, etc.)
 * that are not exposed on public `/api/listings`. Enrich from the live page HTML.
 */
export async function enrichListingFromHtml(accessUrl, req = null) {
  if (!accessUrl) return null;

  const path = String(accessUrl).startsWith("http")
    ? accessUrl
    : `${LISTO_BASE_URL}${accessUrl.startsWith("/") ? "" : "/"}${accessUrl}`;

  try {
    const res = await fetch(path, {
      method: "GET",
      headers: {
        ...buildForwardHeaders(req),
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const html = await res.text();
    const propertyPairs = extractDlPairs(getTabPaneChunk(html, "home"));
    const detailPairs = extractDlPairs(getTabPaneChunk(html, "profile"));
    const entityAi = extractEntityAi(html);
    const { ad_text, extras } = extractDescription(html);

    const roomsFromHtml = extractRooms(html);
    const roomsFromEntity = normalizeRoomsFromEntity(entityAi?.rooms);
    const rooms = roomsFromEntity.length ? roomsFromEntity : roomsFromHtml;
    const walkscore = extractWalkScore(html);
    const neighborhoodVibe = extractNeighborhoodVibe(html);

    const description =
      ad_text ||
      (typeof entityAi?.details === "string" ? entityAi.details : "") ||
      "";

    return {
      propertyPairs,
      detailPairs,
      rooms,
      ad_text: description,
      extras,
      entityAi,
      walkscore,
      neighborhoodVibe,
    };
  } catch (error) {
    console.error("Failed to enrich listing from HTML:", error);
    return null;
  }
}

export function pickPair(pairs = {}, ...labels) {
  for (const label of labels) {
    const value = pairs?.[label];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return null;
}
