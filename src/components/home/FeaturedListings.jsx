"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BedDouble,
  Bath,
  MoveHorizontal,
  Share2,
  Heart,
  ChevronRight,
  MapPin,
  Sparkles,
  Compass,
} from "lucide-react";

import { toast } from "react-hot-toast";
import ListingCards from "../ListingCards";
import { getListingUrl } from "@/lib/listing-url";
import { useLocation } from "@/context/LocationContext";

export default function FeaturedListings() {
  const router = useRouter();
  const { selectedLocation, setIsLocationModalOpen } = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [isCustomLocation, setIsCustomLocation] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favoriteListings")) || [];
    setFavorites(stored);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchListings = async () => {
      setLoading(true);
      try {
        let url = "/api/listings?type=RS&limit=3&sort=ld&order=desc";
        
        if (selectedLocation?.munc_slug) {
          url += `&loc_type=MUNC&search_text=${encodeURIComponent(selectedLocation.munc_slug)}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        if (isMounted) {
          const rows = data?.rows || [];
          if (rows.length > 0) {
            setListings(rows);
            setIsCustomLocation(Boolean(selectedLocation?.munc_slug));
          } else if (selectedLocation?.munc_slug) {
            // Fallback to default featured listings if chosen city has 0 active listings
            const fallbackRes = await fetch("/api/listings?type=RS&limit=3&sort=ld&order=desc");
            const fallbackData = await fallbackRes.json();
            if (isMounted) {
              setListings(fallbackData?.rows || []);
              setIsCustomLocation(false);
            }
          } else {
            setListings([]);
            setIsCustomLocation(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch location featured listings:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchListings();

    return () => {
      isMounted = false;
    };
  }, [selectedLocation]);

  return (
    <section className="bg-[#F7F8FA] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Dynamic Location Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-gray-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-semibold text-[#F58232]">
                <Sparkles size={13} className="text-[#F58232]" />
                Featured Properties
              </span>

              {/* Location Badge with Click-to-Change */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-[#F58232] hover:text-[#F58232]"
              >
                <MapPin size={13} className="text-[#F58232]" />
                <span>
                  Location: <strong className="text-slate-900 group-hover:text-[#F58232]">{selectedLocation?.name || "All Ontario"}</strong>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold group-hover:text-[#F58232] underline ml-1">
                  Change
                </span>
              </button>
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111827]">
              {selectedLocation?.name
                ? `Featured Listings in ${selectedLocation.name}`
                : "Featured Listings Across Ontario"}
            </h2>

            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-[#6B7280]">
              {isCustomLocation
                ? `Showing the latest active residential properties in ${selectedLocation?.name}.`
                : "Explore hand-picked residential opportunities, developments, and top market deals."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-[#F58232] hover:text-[#F58232] active:scale-95"
            >
              <Compass size={16} className="text-[#F58232]" />
              Change City
            </button>

            <Link
              href={
                selectedLocation?.munc_slug
                  ? `/real-estate-listings?munc_slug=${encodeURIComponent(selectedLocation.munc_slug)}`
                  : "/real-estate-listings"
              }
              className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-[#F58232] hover:bg-[#e67428] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:brightness-105"
            >
              Browse All
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[460px] animate-pulse rounded-[32px] bg-white border border-gray-100 shadow-sm"
              />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <>
            <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {listings.slice(0, 3).map((listing, index) => (
                <ListingCards listing={listing} index={index} key={listing.id || index} />
              ))}
            </div>

            <div className="mt-8 flex justify-center sm:hidden">
              <Link
                href={
                  selectedLocation?.munc_slug
                    ? `/listings?munc_slug=${encodeURIComponent(selectedLocation.munc_slug)}`
                    : "/listings"
                }
                className="rounded-2xl border border-[#F58232] bg-white px-6 py-3 text-xs font-bold text-[#F58232] shadow-sm"
              >
                View All Listings
              </Link>
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <MapPin size={36} className="mx-auto text-slate-300 mb-3" />
            <h4 className="text-base font-bold text-slate-800">
              No Listings Found in {selectedLocation?.name || "Selected Area"}
            </h4>
            <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
              There are currently no active featured properties for this specific market. Try switching to a nearby city or explore all Ontario.
            </p>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#F58232] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:bg-[#e67428]"
            >
              Choose Another City
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

