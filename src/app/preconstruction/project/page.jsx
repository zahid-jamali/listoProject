"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  ChevronLeft,
  ChevronRight,
  Home,
  Layers,
  MapPin,
  Maximize2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import PreConstructionHero from "@/components/preconstruction/PreConstructionHero";
import ProjectDetailsAndTimelines from "@/components/preconstruction/ProjectDetailsAndTimelines";
import PreConstructionFeaturesAndFacilities from "@/components/preconstruction/PreConstructionFeaturesAndFacilities";
import WhatsBeingBuilt from "@/components/preconstruction/WhatsBeingBuilt";
import MediaAndPriceList from "@/components/preconstruction/MediaAndPriceList";
import DepositStructure from "@/components/preconstruction/DepositStructure";
import ProjectInquiryCard from "@/components/preconstruction/ProjectInquiryCard";
import ProjectRegisterCard from "@/components/preconstruction/ProjectRegisterCard";
import { decodeListingData } from "@/lib/url-helper";
import {
  parseProjectPath,
  readStashedProject,
} from "@/lib/listing-url";

function formatCurrency(value, country) {
  const num = Number(String(value || "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num) || num === 0) return value || "—";
  if (String(country || "").toUpperCase() === "UAE") {
    return `AED ${num.toLocaleString("en-US")}`;
  }
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(num);
}

function PageSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-[#F58232] border-t-transparent" />
        <p className="text-sm font-medium text-slate-600">
          Loading project details…
        </p>
      </div>
    </div>
  );
}

function StatChip({ icon: Icon, value, label }) {
  if (!value) return null;
  return (
    <div className="flex min-w-[120px] flex-col items-center gap-1 text-center">
      <Icon className="h-5 w-5 text-[#F36B22]" />
      <p className="text-sm font-bold text-[#0B132B]">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  );
}

function PreConstructionDetailContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageData, setPageData] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeHeroPhotoIndex, setActiveHeroPhotoIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const seo = parseProjectPath(pathname);
      const p = searchParams.get("p");
      let seed = null;

      if (p) {
        try {
          seed = decodeListingData(p);
        } catch {
          seed = null;
        }
      }
      if (!seed) seed = readStashedProject(pathname);

      const payload = {
        access_url: seo?.access_url || seed?.access_url || "",
        area_slug: seo?.area_slug || seed?.area_slug || "",
        slug: seo?.slug || "",
        dv_id: seo?.dv_id || seed?.dv_id || seed?.development_id || seed?.id || "",
        project_id: seo?.project_id || seed?.project_id || "",
        title: seed?.title || "",
        search: "",
        ...(seed || {}),
      };

      // Prefer SEO path access_url for style2 URLs
      if (seo?.access_url) {
        payload.access_url = seo.access_url.startsWith("/")
          ? seo.access_url
          : `/${seo.access_url}`;
      }

      if (
        !payload.access_url &&
        !payload.dv_id &&
        !payload.area_slug &&
        !payload.title
      ) {
        setError(
          "No project selected. Browse pre-construction listings and choose a project.",
        );
        setPageData(null);
        return;
      }

      const res = await fetch("/api/project-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to load project");
      }

      setPageData(data);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong while loading this project.");
      setPageData(null);
    } finally {
      setLoading(false);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const project = pageData?.project || null;
  const photos = pageData?.photos || [];

  const openGallery = (index = 0) => {
    setPhotoIndex(index);
    setGalleryOpen(true);
  };

  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => String(f.id) === String(item?.id));
      if (exists) return prev.filter((f) => String(f.id) !== String(item?.id));
      return [...prev, item];
    });
  };

  const handleShare = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      if (navigator.share) {
        await navigator.share({
          title: project?.title || "Project",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      /* user cancelled */
    }
  };

  const mapUrl = useMemo(() => {
    if (project?.lat && project?.lng) {
      return `https://maps.google.com/maps?q=${project.lat},${project.lng}&z=15&output=embed`;
    }
    return null;
  }, [project?.lat, project?.lng]);

  const statusBadge = pageData?.statusBadge || null;

  if (loading) return <PageSkeleton />;

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-6">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#F58232]">
            <Building2 size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Project unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>
          <Link
            href="/pre-construction-projects-by-area"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#081A3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102752]"
          >
            <ArrowLeft size={16} />
            Browse projects
          </Link>
        </div>
      </div>
    );
  }

  const priceText =
    project.lp_dol_text ||
    formatCurrency(project.lp_dol, project.country);

  return (
    <>
      {galleryOpen && photos.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <button
            type="button"
            onClick={() => setGalleryOpen(false)}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>
          <button
            type="button"
            onClick={() =>
              setPhotoIndex((p) => (p - 1 + photos.length) % photos.length)
            }
            className="absolute left-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={28} />
          </button>
          <img
            src={photos[photoIndex]?.src}
            alt={`${project?.title} photo ${photoIndex + 1}`}
            className="max-h-[88vh] max-w-[92vw] object-contain"
          />
          <button
            type="button"
            onClick={() => setPhotoIndex((p) => (p + 1) % photos.length)}
            className="absolute right-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={28} />
          </button>
          <div className="absolute bottom-6 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
            {photoIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#f7f7f7] pb-24 lg:pb-16">
        <PreConstructionHero
          photos={photos}
          activeHeroPhotoIndex={activeHeroPhotoIndex}
          setActiveHeroPhotoIndex={setActiveHeroPhotoIndex}
          project={project}
          statusBadge={statusBadge}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          handleShare={handleShare}
          openGallery={openGallery}
          formatCurrency={(v) => formatCurrency(v, project.country)}
        />

        {/* Title strip */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-end sm:justify-between lg:px-6">
            <div className="min-w-0">
              <h1 className="text-2xl font-black tracking-tight text-[#0B132B] sm:text-3xl">
                {project.title}
              </h1>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                {project.product_types}
              </p>
              <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-500">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#F36B22]" />
                {[project.addr, project.community, project.municipality]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {project.developer_name && (
                <div className="mt-3 flex items-center gap-3">
                  {project.dv_thumbnail ? (
                    <img
                      src={project.dv_thumbnail}
                      alt={project.developer_name}
                      className="h-12 w-12 rounded-lg object-contain"
                    />
                  ) : null}
                  <p className="text-sm text-slate-600">
                    by{" "}
                    <span className="font-bold text-[#F36B22]">
                      {project.developer_name}
                    </span>
                  </p>
                </div>
              )}
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Starting from
              </p>
              <p className="text-2xl font-black text-[#0B132B]">{priceText}</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-7xl px-4 pt-6 lg:px-6">
          <div className="flex flex-wrap justify-around gap-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <StatChip
              icon={Home}
              value={project.product_types}
              label="Unit Types"
            />
            <StatChip
              icon={Maximize2}
              value={
                project.sqft || project.sqft_max
                  ? `${project.sqft || ""}${project.sqft_max ? `–${project.sqft_max}` : ""} sqft`
                  : null
              }
              label="Size Range"
            />
            <StatChip
              icon={Layers}
              value={
                Number(project.units_total) > 0 ? project.units_total : null
              }
              label="Total Units"
            />
            <StatChip
              icon={Building2}
              value={project.storeys ? `${project.storeys} floors` : null}
              label="Storeys"
            />
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-8">
            {/* LEFT */}
            <div className="min-w-0 space-y-2">
              <ProjectDetailsAndTimelines
                project={project}
                statusBadge={statusBadge}
                photos={photos}
                openGallery={openGallery}
              />

              {(pageData.videos || []).length > 0 && (
                <section className="grid gap-4 py-4 sm:grid-cols-2">
                  {pageData.videos.map((src) => (
                    <div
                      key={src}
                      className="aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm"
                    >
                      <iframe
                        src={src}
                        title="Project video"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ))}
                </section>
              )}

              <MediaAndPriceList docs={pageData.docs || []} />

              <WhatsBeingBuilt
                products={pageData.products || []}
                models={pageData.models || []}
                project={project}
              />

              <PreConstructionFeaturesAndFacilities
                features={pageData.features || []}
                highlights={pageData.highlights || []}
                showcase2={pageData.showcase2}
                project={project}
              />

              <DepositStructure
                project={project}
                showcase1={pageData.showcase1}
              />

              <ProjectRegisterCard project={project} />

              {mapUrl && (
                <section className="w-full py-4">
                  <h2 className="mb-4 text-2xl font-bold text-[#0B132B] lg:text-3xl">
                    Location
                  </h2>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <iframe
                      title="Project location"
                      src={mapUrl}
                      className="h-[320px] w-full border-0"
                      loading="lazy"
                    />
                  </div>
                </section>
              )}
            </div>

            {/* RIGHT: sticky inquiry */}
            <aside className="order-first lg:order-none lg:sticky lg:top-24 lg:z-20">
              <ProjectInquiryCard
                project={project}
                agent={pageData.agent}
                defaultMessage={pageData.contact?.defaultMessage}
              />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

export default function PreConstructionProjectPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PreConstructionDetailContent />
    </Suspense>
  );
}
