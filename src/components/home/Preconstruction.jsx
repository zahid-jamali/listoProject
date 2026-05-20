// Better UI Version
// src/components/home/FeaturedListings.jsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  MoveHorizontal,
  Share2,
  Heart,
  ChevronRight,
  MapPin,
} from "lucide-react";

export default function PreConstruction() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/featured");
        const data = await response.json();

        setListings(data?.PC || []);
      } catch (error) {
        console.error("Failed to fetch featured listings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <section className="w-full bg-[#f7f7f7] py-16 lg:py-20">
      <div className="container mx-auto">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[34px] font-extrabold tracking-[-1px] text-black lg:text-[44px]">
                Trending Pre-Construction
              </h2>

              <p className="mt-2 text-[15px] text-neutral-500">
                Discover premium projects and investment opportunities
              </p>
            </div>

            <Link
              href="/featured"
              className="hidden items-center gap-2 text-[15px] font-semibold text-[#F58233] transition-all hover:gap-3 md:flex"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[520px] animate-pulse rounded-[28px] bg-white"
                />
              ))}
            </div>
          ) : (
            <>
              {/* CARDS */}
              <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
                {Array.isArray(listings) &&
                  listings.slice(0, 3).map((listing) => (
                    <div
                      key={listing.id}
                      className="group overflow-hidden rounded-[28px] border border-neutral-200 border-2 bg-[#040F23] text-white shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                    >
                      {/* IMAGE */}
                      <div className="relative h-[280px] overflow-hidden">
                        <img
                          src={listing.thumbnail}
                          alt={listing.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                        {/* TOP BADGES */}
                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                          {listing.badges1?.slice(0, 2).map((badge, index) => (
                            <div
                              key={index}
                              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-md backdrop-blur-xl ${
                                badge.display === "PC"
                                  ? "bg-[#F58233] text-white"
                                  : "bg-white/90 text-black"
                              }`}
                            >
                              {badge.text}
                            </div>
                          ))}
                        </div>

                        {/* FAVORITE */}
                        <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110">
                          <Heart size={17} className="text-neutral-700" />
                        </button>

                        {/* PRICE AREA */}
                        <div className="absolute bottom-5 left-5 right-5">
                          <h3 className="text-[32px] font-extrabold tracking-[-1px] text-white">
                            {listing.lp_dol_text}
                          </h3>

                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#F58233]" />

                            <p className="line-clamp-1 text-[14px] font-medium text-white/90">
                              {listing.product_types}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-6">
                        {/* TITLE */}
                        <h3 className="line-clamp-1 text-[28px] font-bold tracking-[-0.5px] text-white">
                          {listing.title}
                        </h3>

                        {/* DEVELOPER */}
                        <p className="mt-1 text-[13px] font-semibold uppercase tracking-[1px] text-[#F58233]">
                          by {listing.developer_name}
                        </p>

                        {/* LOCATION */}
                        <div className="mt-4 flex items-start gap-2">
                          <MapPin
                            size={16}
                            className="mt-[4px] text-neutral-400"
                          />

                          <p className="line-clamp-2 text-[14px] leading-[24px] text-neutral-600">
                            {listing.addr}, {listing.community}
                          </p>
                        </div>

                        {/* FEATURES */}
                        <div className="mt-5 flex flex-wrap gap-2">
                          <div className="flex items-center gap-2 rounded-full bg-[#f5f5f5] px-3 py-2 text-[12px] font-medium text-neutral-700">
                            <BedDouble size={14} />
                            Luxury
                          </div>

                          <div className="flex items-center gap-2 rounded-full bg-[#f5f5f5] px-3 py-2 text-[12px] font-medium text-neutral-700">
                            <Bath size={14} />
                            Premium
                          </div>

                          <div className="flex items-center gap-2 rounded-full bg-[#f5f5f5] px-3 py-2 text-[12px] font-medium text-neutral-700">
                            <MoveHorizontal size={14} />
                            {listing.sqft} - {listing.sqft_max} sqft
                          </div>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-7 flex items-center justify-between border-t border-neutral-100 pt-5">
                          {/* BUTTON */}
                          <Link
                            href={listing.access_url}
                            className="flex items-center gap-2 rounded-xl bg-[#F58233] px-5 py-3 text-[14px] font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#e46f1d]"
                          >
                            View Details
                            <ChevronRight size={16} />
                          </Link>

                          {/* ACTIONS */}
                          <div className="flex items-center gap-3">
                            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 transition-all duration-300 hover:border-[#F58233] hover:text-[#F58233]">
                              <Share2 size={16} />
                            </button>

                            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 transition-all duration-300 hover:border-[#F58233] hover:text-[#F58233]">
                              <Heart size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* MOBILE BUTTON */}
              <div className="mt-10 flex justify-center md:hidden">
                <Link
                  href="/featured"
                  className="flex items-center gap-2 rounded-xl border border-[#F58233] px-6 py-3 text-[15px] font-semibold text-[#F58233]"
                >
                  View All
                  <ChevronRight size={16} />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
