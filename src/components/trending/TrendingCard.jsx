"use client";

import Link from "next/link";
import {
  BedDouble,
  Bath,
  Camera,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
} from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrendingCard({ listing }) {
  const [active, setActive] = useState(0);
  const router = useRouter();

  const photos =
    listing.photos?.length > 0 ? listing.photos : [listing.thumbnail];

  const next = () => {
    setActive((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setActive((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleClick = (listing) => {
    sessionStorage.setItem("listing", JSON.stringify(listing));
    router.push(
      `/listings/ind?id=${encodeURIComponent(listing.id)}&type=${encodeURIComponent(listing.type || "RS")}&brd=${encodeURIComponent(listing.brd || "")}`,
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#1A2942] bg-[#031126] shadow-[0_10px_35px_rgba(0,0,0,0.15)]">
      {/* IMAGE */}
      <div className="relative h-[200px]">
        <img
          src={photos[active]}
          alt={listing.addr}
          className="h-full w-full object-cover"
        />

        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2"
        >
          <ChevronLeft className="text-white" />
        </button>

        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <ChevronRight className="text-white" />
        </button>

        {/* badges */}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {listing.badges1?.map((badge, i) => (
            <span
              key={i}
              className="rounded-full bg-white/90 px-1 py-1 text-[10px] font-medium"
            >
              {badge.text}
            </span>
          ))}
        </div>

        <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white flex items-center gap-1">
          <Camera size={12} />
          {listing.photos_total} Photos
        </div>
      </div>

      {/* CONTENT */}

      <div className="p-3">
        <h3 className="text-[34px] font-black text-white">
          {listing.lp_dol_text}
        </h3>

        <p className="mt-1 text-white text-[15px] leading-6">{listing.addr}</p>

        <p className="text-gray-400 text-sm">{listing.municipality}</p>

        {/* features */}

        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>
            <BedDouble size={13} />
            {listing.br}
          </Badge>

          <Badge>
            <Bath size={13} />
            {listing.bath_tot}
          </Badge>

          <Badge>
            <Maximize2 size={13} />
            {listing.sqft}
          </Badge>
        </div>

        <div className="mt-2 border-t border-white/10 pt-4 flex items-center justify-between">
          <button
            onClick={() => {
              handleClick(listing);
            }}
            className="h-10 px-8 rounded-md bg-[#F58233] text-white text-sm font-semibold flex items-center justify-center hover:opacity-90"
          >
            Details →
          </button>

          <div className="flex gap-4 text-white">
            <Bookmark size={16} />

            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.48 2.48 0 0 0 0-1.39l7-4.11A2.99 2.99 0 1 0 15 5a2.8 2.8 0 0 0 .05.52l-7 4.11a3 3 0 1 0 0 4.74l7.12 4.18A2.8 2.8 0 0 0 15 19a3 3 0 1 0 3-2.92Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#07162E]">
      {children}
    </div>
  );
}
