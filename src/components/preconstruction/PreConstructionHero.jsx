"use client";

import { MapPin, Sparkles, ChevronLeft, ChevronRight, Heart, Share2, ImageIcon, Building2 } from "lucide-react";
import Bookmark from "../Bookmark";

export default function PreConstructionHero({
  photos = [],
  activeHeroPhotoIndex = 0,
  setActiveHeroPhotoIndex,
  project = {},
  statusBadge = null,
  favorites = [],
  toggleFavorite,
  handleShare,
  openGallery,
  formatCurrency,
}) {
  const isFavorited = favorites.some((item) => item.id === project?.id);

  return (
    <section className="relative w-full">
      {/* ── Dual Image Header Slider ── */}
      <div className="relative w-full bg-black overflow-hidden h-[340px] sm:h-[440px] md:h-[540px]">
        {photos.length > 0 ? (
          <div className="flex h-full w-full">
            {/* Left Image (Active index) */}
            <div className="relative w-full md:w-1/2 h-full border-r border-black overflow-hidden">
              <img
                src={photos[activeHeroPhotoIndex]?.src}
                alt={project?.title || "Project Photo"}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>
            {/* Right Image (Next index) - hidden on mobile */}
            <div className="relative hidden md:block w-1/2 h-full overflow-hidden">
              <img
                src={photos[(activeHeroPhotoIndex + 1) % photos.length]?.src}
                alt={project?.title || "Project Photo"}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-200">
            <ImageIcon size={64} className="text-slate-400 animate-pulse" />
          </div>
        )}

        {/* Slider Controls */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveHeroPhotoIndex((p) => (p - 1 + photos.length) % photos.length)
              }
              className="absolute left-2.5 sm:left-6 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-800 transition shadow-lg focus:outline-none z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} className="sm:hidden" />
              <ChevronLeft size={24} className="hidden sm:block" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveHeroPhotoIndex((p) => (p + 1) % photos.length)
              }
              className="absolute right-2.5 sm:right-6 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-800 transition shadow-lg focus:outline-none z-10"
              aria-label="Next photo"
            >
              <ChevronRight size={20} className="sm:hidden" />
              <ChevronRight size={24} className="hidden sm:block" />
            </button>
          </>
        )}

        {/* Photos Count Badge */}
        {photos.length > 0 && (
          <button
            type="button"
            onClick={() => openGallery(activeHeroPhotoIndex)}
            className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 flex items-center gap-1.5 sm:gap-2 rounded-full bg-black/60 hover:bg-black/85 text-white px-3.5 py-2 sm:px-5 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition backdrop-blur-sm z-10"
          >
            <ImageIcon size={14} />
            View Photos
          </button>
        )}
      </div>

      {/* ── Overlay Title Card (Reference-inspired) ── */}
      <div className="relative max-w-7xl mx-auto px-4 -mt-12 md:-mt-16 z-20">
        <div className="bg-white rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.12)] p-6 md:p-8 border border-slate-100/50">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Left Column: Title & Address */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#F58232]">
                  <Building2 size={12} />
                  Pre-construction
                </span>
                {statusBadge && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {statusBadge.text}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                {project?.title}
              </h1>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Developed by {project?.developer_name || "Premier Developer"}
              </p>
              <p className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <MapPin size={16} className="text-[#F58232] shrink-0" />
                {[project?.addr, project?.community, project?.municipality]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            {/* Middle Column: Pricing */}
            <div className="flex flex-col lg:items-end min-w-[200px]">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Starting From
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-[#F58232] tracking-tight mt-1">
                {project?.lp_dol_text ||
                  formatCurrency(project?.lp_dol || project?.lp_dol_from) ||
                  "Pricing TBD"}
              </h2>
            </div>

            {/* Right Column: Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleShare(project)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition"
                title="Share Project"
              >
                <Share2 size={20} />
              </button>
              <Bookmark listing={project} className="h-12 w-12 rounded-full" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
