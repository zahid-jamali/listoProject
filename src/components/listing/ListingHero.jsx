"use client";

import { useEffect, useState } from "react";
import {
  Share2,
  Camera,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import Bookmark from "@/components/Bookmark";
import { getListingOffer } from "@/lib/listing-url";

function formatCurrency(value) {
  const num = Number(String(value || "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num)) return value || "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(num);
}

function PhotoTile({
  src,
  alt,
  onClick,
  className = "",
  priority = false,
  overlay = null,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative block h-full w-full overflow-hidden bg-slate-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F36B22] focus-visible:ring-inset ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-200">
          <ImageIcon className="text-slate-400" size={40} />
        </div>
      )}
      <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
      {overlay}
    </button>
  );
}

export default function ListingHero({
  heroImage,
  title,
  subtitle,
  price,
  priceText,
  priceKind = "sale",
  priceLabel,
  leasePriceText,
  beds,
  baths,
  sqft,
  photos = [],
  listing = null,
  onBack,
  onShare,
  onOpenGallery,
}) {
  const displayImages =
    photos.length > 0
      ? photos.map((p) => p.src).filter(Boolean)
      : heroImage
        ? [heroImage]
        : [];

  const [active, setActive] = useState(0);
  const count = displayImages.length;
  const main = displayImages[active] || displayImages[0] || null;

  useEffect(() => {
    setActive(0);
  }, [displayImages[0]]);

  const goPrev = () => {
    if (count < 2) return;
    setActive((i) => (i - 1 + count) % count);
  };

  const goNext = () => {
    if (count < 2) return;
    setActive((i) => (i + 1) % count);
  };

  const openAt = (index) => onOpenGallery?.(index);

  const sideCount = Math.min(4, Math.max(0, count - 1));
  const sideSlots = Array.from({ length: sideCount }, (_, i) => {
    const idx = (active + i + 1) % count;
    return { src: displayImages[idx], index: idx };
  });

  const showMosaic = count >= 3;
  const offer = listing
    ? getListingOffer(listing)
    : {
        kind: priceKind === "lease" ? "rent" : "sale",
        label: priceKind === "lease" ? "For Rent" : "For Sale",
      };
  const isRent = offer.kind === "rent";

  return (
    <section className="w-full overflow-x-hidden">
      <div className="relative mx-auto max-w-[1400px] px-0 sm:px-4 sm:pt-4 lg:px-6">
        <div className="relative overflow-hidden bg-[#0B132B] sm:rounded-2xl">
          {/* Desktop mosaic / dual / single */}
          {showMosaic ? (
            <div className="hidden h-[420px] gap-1.5 md:grid md:h-[460px] md:grid-cols-[1.55fr_1fr] lg:h-[520px]">
              <PhotoTile
                src={main}
                alt={title || "Property photo"}
                priority
                onClick={() => openAt(active)}
              />
              <div
                className={`grid h-full gap-1.5 ${
                  sideSlots.length >= 3
                    ? "grid-cols-2 grid-rows-2"
                    : "grid-cols-1 grid-rows-2"
                }`}
              >
                {sideSlots.map((slot, i) => {
                  const isLast = i === sideSlots.length - 1;
                  const extra = count - (1 + sideSlots.length);
                  const showMore = isLast && extra > 0;

                  return (
                    <PhotoTile
                      key={`${slot.index}-${i}`}
                      src={slot.src}
                      alt={`${title || "Property"} photo ${slot.index + 1}`}
                      onClick={() => openAt(slot.index)}
                      className={
                        sideSlots.length === 3 && i === 0 ? "col-span-2" : ""
                      }
                      overlay={
                        showMore ? (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-bold text-white transition group-hover:bg-black/65">
                            +{extra} more
                          </span>
                        ) : null
                      }
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              className={`hidden h-[420px] md:grid md:h-[460px] lg:h-[520px] ${
                count >= 2 ? "grid-cols-2 gap-1.5" : "grid-cols-1"
              }`}
            >
              <PhotoTile
                src={main}
                alt={title || "Property photo"}
                priority
                onClick={() => openAt(active)}
              />
              {count >= 2 && (
                <PhotoTile
                  src={displayImages[(active + 1) % count]}
                  alt={`${title || "Property"} photo 2`}
                  onClick={() => openAt((active + 1) % count)}
                />
              )}
            </div>
          )}

          {/* Mobile carousel */}
          <div className="relative h-[280px] sm:h-[360px] md:hidden">
            {main ? (
              <button
                type="button"
                className="h-full w-full"
                onClick={() => openAt(active)}
              >
                <img
                  src={main}
                  alt={title || "Property"}
                  className="h-full w-full object-cover"
                />
              </button>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-200">
                <ImageIcon className="text-slate-400" size={48} />
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/70 sm:left-5 sm:top-5"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          )}

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0B132B] shadow-lg transition hover:bg-white md:left-5"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0B132B] shadow-lg transition hover:bg-white md:right-5"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {count > 0 && (
            <button
              type="button"
              onClick={() => openAt(active)}
              className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-full bg-black/65 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-black/80 sm:bottom-5 sm:right-5"
            >
              <Camera size={14} />
              {count} photos
            </button>
          )}

          {count > 1 && (
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 md:hidden">
              {displayImages.slice(0, 8).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to photo ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition ${
                    i === active ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="-mt-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_18px_50px_rgba(11,19,43,0.12)] sm:-mt-8 sm:p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <div className="min-w-0 flex-1">
              <h1 className="break-words text-xl font-bold leading-tight text-[#0B132B] sm:text-2xl md:text-3xl lg:text-4xl">
                {title || "—"}
              </h1>
              <p className="mt-1.5 break-words text-sm text-slate-500 sm:mt-2 sm:text-base">
                {subtitle || "—"}
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:flex-col lg:items-end lg:gap-3 xl:flex-row xl:items-center xl:gap-6">
              <div className="min-w-0 lg:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
                  Price
                </p>
                <h2 className="break-words text-2xl font-bold text-[#0B132B] sm:text-3xl">
                  {priceText || formatCurrency(price)}
                  {isRent &&
                  !/\/\s*(mth|mo|month)/i.test(String(priceText || "")) ? (
                    <span className="text-base font-medium text-slate-400">
                      {" "}
                      /mth
                    </span>
                  ) : null}
                </h2>
                <span
                  className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide sm:text-xs ${
                    isRent
                      ? "bg-sky-50 text-sky-800 ring-1 ring-sky-200"
                      : "bg-orange-50 text-[#C2410C] ring-1 ring-orange-200"
                  }`}
                >
                  {offer.label}
                </span>
                {priceKind === "sale" && isRent && leasePriceText ? (
                  <p className="mt-1 text-sm text-slate-500">
                    Also listed for lease {leasePriceText}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-xs">
                    Beds
                  </p>
                  <p className="text-base font-bold text-[#0B132B] sm:text-lg">
                    {beds || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-xs">
                    Baths
                  </p>
                  <p className="text-base font-bold text-[#0B132B] sm:text-lg">
                    {baths || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-xs">
                    Sqft
                  </p>
                  <p className="text-base font-bold text-[#0B132B] sm:text-lg">
                    {sqft || "—"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-2 sm:gap-3">
                {listing && (
                  <Bookmark
                    listing={listing}
                    className="h-10 w-10 rounded-full border-0 bg-gray-100 sm:h-12 sm:w-12"
                  />
                )}
                <button
                  type="button"
                  onClick={onShare}
                  aria-label="Share listing"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-slate-700 transition hover:bg-gray-200 sm:h-12 sm:w-12"
                >
                  <Share2 size={18} />
                </button>
                {count > 0 && (
                  <button
                    type="button"
                    onClick={() => openAt(active)}
                    aria-label="Open photo gallery"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-slate-700 transition hover:bg-gray-200 sm:h-12 sm:w-12"
                  >
                    <Camera size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
