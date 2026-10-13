"use client";

import {
  BedDouble,
  Bath,
  Camera,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getListingUrl, stashListing } from "@/lib/listing-url";
import Bookmark from "@/components/Bookmark";

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
    stashListing(listing);
    router.push(getListingUrl(listing));
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}${getListingUrl(listing)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.addr || "LISTO Property",
          text: `Check out ${listing.addr || "this property"} on LISTO`,
          url,
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Listing link copied to clipboard!");
    } catch {
      toast.error("Unable to copy link");
    }
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
          {(Array.isArray(listing.badges1) ? listing.badges1 : []).map(
            (badge, i) => (
              <span
                key={i}
                className="rounded-full bg-white/90 px-1 py-1 text-[10px] font-medium"
              >
                {badge?.text}
              </span>
            ),
          )}
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

          <div className="flex items-center gap-2 text-white">
            <Bookmark
              listing={listing}
              className="!border-white/20 !text-white hover:!border-[#F97316] hover:!text-[#F97316]"
            />

            <button
              type="button"
              onClick={handleShare}
              title="Share listing"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 text-white transition hover:border-[#F97316] hover:text-[#F97316]"
            >
              <Share2 size={15} />
            </button>
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
