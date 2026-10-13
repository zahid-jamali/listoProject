import { fetchListoJson } from "@/lib/listo-proxy";

const PHOTO_HOST = "https://images.listo.ca/";

function normalizeUrl(value = "") {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "")
    .toLowerCase();
}

function photoUrl(keyOrUrl) {
  if (!keyOrUrl) return null;
  const raw = String(keyOrUrl).trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${PHOTO_HOST}${raw.replace(/^\//, "")}`;
}

function normalizePhotos(photos = []) {
  return (Array.isArray(photos) ? photos : [])
    .map((photo, index) => {
      const src =
        photoUrl(photo?.s3Key) ||
        photoUrl(photo?.src) ||
        photoUrl(typeof photo === "string" ? photo : null);
      if (!src) return null;
      return {
        src,
        caption: photo?.caption || photo?.name || "",
        name: photo?.name || "",
        index,
      };
    })
    .filter(Boolean);
}

function normalizeDocs(docs = []) {
  return (Array.isArray(docs) ? docs : [])
    .map((doc) => {
      const href = photoUrl(doc?.s3Key) || photoUrl(doc?.href);
      if (!href) return null;
      return {
        href,
        caption: doc?.caption || doc?.name || "Document",
        name: doc?.name || "",
      };
    })
    .filter(Boolean);
}

function formatOccDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-CA", {
    month: "short",
    year: "numeric",
  });
}

function slugToSearch(slug = "") {
  const part = String(slug || "")
    .split("-")
    .filter(Boolean)[0];
  return part || "";
}

function pickProject(rows = [], hints = {}) {
  const list = Array.isArray(rows) ? rows : [];
  if (!list.length) return null;

  const accessNorm = normalizeUrl(hints.access_url);
  if (accessNorm) {
    const byUrl = list.find((row) => {
      const rowUrl = normalizeUrl(row?.access_url);
      return (
        rowUrl === accessNorm ||
        rowUrl === accessNorm.replace(/^\//, "") ||
        `/${rowUrl}` === accessNorm ||
        rowUrl.endsWith(accessNorm) ||
        accessNorm.endsWith(rowUrl)
      );
    });
    if (byUrl) return byUrl;
  }

  if (hints.dv_id != null && hints.dv_id !== "") {
    const byId = list.find(
      (row) => String(row?.id) === String(hints.dv_id),
    );
    if (byId) return byId;
  }

  if (hints.slug) {
    const bySlug = list.find((row) =>
      String(row?.access_url || "")
        .toLowerCase()
        .includes(String(hints.slug).toLowerCase()),
    );
    if (bySlug) return bySlug;
  }

  if (list.length === 1) return list[0];
  return null;
}

/**
 * Resolve a pre-construction project the same way legacy style2 pages do:
 * look up by access_url / area+slug / ids, then load models + products.
 */
export async function buildProjectPageData(input = {}) {
  let access_url = input.access_url || "";
  const area_slug = input.area_slug || "";
  const slug = input.slug || "";
  const dv_id = input.dv_id || input.development_id || input.id || "";
  const project_id = input.project_id || "";
  const searchHint = input.search || "";

  if (!access_url && area_slug && slug) {
    access_url = `/pre-construction-condos-${area_slug}/${slug}`;
  }

  const search =
    searchHint ||
    slugToSearch(slug) ||
    (access_url
      ? slugToSearch(access_url.split("/").filter(Boolean).pop())
      : "") ||
    String(input.title || "").split(/\s+/)[0] ||
    "";

  const listParams = {
    type: "PC",
    limit: "30",
    incl_total: "1",
    sort: "id",
    order: "desc",
  };

  if (area_slug) listParams.area_slug = area_slug;
  if (search) listParams.search = search;

  const listResult = await fetchListoJson("/api/get_projects", listParams);
  let project = pickProject(listResult?.rows || [], {
    access_url,
    dv_id,
    slug,
  });

  // Fallback: stashed/card object already has enough fields
  if (!project && (input.title || input.lp_dol || input.thumbnail)) {
    project = { ...input };
  }

  if (!project) {
    throw new Error("Project not found");
  }

  const developmentId = project.id || dv_id;
  const parentProjectId = project.project_id || project_id;

  const [modelsResult, productsResult] = await Promise.allSettled([
    developmentId
      ? fetchListoJson("/api/get_models", {
          dv_id: String(developmentId),
          limit: "50",
        })
      : Promise.resolve([]),
    developmentId
      ? fetchListoJson("/api/get_products", {
          dv_id: String(developmentId),
          limit: "50",
        })
      : Promise.resolve([]),
  ]);

  const modelsRaw =
    modelsResult.status === "fulfilled"
      ? Array.isArray(modelsResult.value)
        ? modelsResult.value
        : modelsResult.value?.rows || []
      : [];

  const productsRaw =
    productsResult.status === "fulfilled"
      ? Array.isArray(productsResult.value)
        ? productsResult.value
        : productsResult.value?.rows || []
      : [];

  const photos = normalizePhotos(project.photos);
  if (!photos.length && project.thumbnail) {
    photos.push({ src: photoUrl(project.thumbnail), caption: "", index: 0 });
  }

  const docs = normalizeDocs(project.docs);
  const videos = (Array.isArray(project.videos) ? project.videos : []).filter(
    (v) => v && String(v).trim(),
  );

  const statusBadge =
    (project.badges1 || []).find((b) => b.display === "PC") ||
    (project.badges1 || [])[0] ||
    null;

  const defaultMessage =
    project.status === "A" || project.status === "CS"
      ? `I'm interested in ${project.title}. Please send me price list, and unit availability.`
      : `I'm interested in similar properties to ${project.title || "this project"}.`;

  return {
    success: true,
    project: {
      ...project,
      dv_id: developmentId,
      development_id: developmentId,
      project_id: parentProjectId,
      access_url: project.access_url || access_url || "",
      occupancy: formatOccDate(project.occ_date),
      occupancy_date: formatOccDate(project.occ_date),
    },
    photos,
    docs,
    videos,
    models: modelsRaw,
    products: productsRaw,
    features: project.features_json || [],
    highlights: project.highlights || [],
    showcase1: project.showcase1 || null,
    showcase2: project.showcase2 || null,
    statusBadge,
    agent: project.agent || {
      name: [project.ag_first_name, project.ag_last_name]
        .filter(Boolean)
        .join(" "),
      phone: project.ag_phone || null,
      email: project.ag_email || null,
      thumbnail: project.ag_thumbnail || null,
    },
    contact: {
      defaultMessage,
    },
    meta: {
      title: project.meta_title || `${project.title} by ${project.developer_name}`,
      description: project.meta_description || null,
      developmentId,
      projectId: parentProjectId,
      counts: {
        photos: photos.length,
        docs: docs.length,
        models: modelsRaw.length,
        products: productsRaw.length,
      },
    },
  };
}
