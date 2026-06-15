"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BedDouble,
  Bath,
  MoveHorizontal,
  Share2,
  Heart,
  ChevronRight,
  MapPin,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
    },
  }),
};

export default function PreConstruction() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/featured?limit=3");
        const data = await response.json();
        setListings(data?.PC || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <section className="bg-[#F7F8FA] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-4 py-2 text-sm font-medium text-[#F97316]">
              Platinum Access Projects
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
              Trending Pre‑Construction
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6B7280] sm:text-base">
              Explore high-demand developments, exclusive launches and
              investment opportunities before they hit the broader market.
            </p>
          </div>

          <Link
            href="/preconstruction"
            className="hidden items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition-all hover:border-[#F97316] hover:text-[#F97316] md:flex"
          >
            View All Projects
            <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.05)]"
              >
                {/* Image Skeleton */}
                <div className="relative h-[280px] animate-pulse bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100">
                  <div className="absolute left-4 top-4 h-7 w-20 rounded-full bg-white/70" />
                  <div className="absolute left-28 top-4 h-7 w-16 rounded-full bg-white/70" />
                  <div className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/70" />

                  <div className="absolute bottom-5 left-5">
                    <div className="h-8 w-28 rounded-lg bg-white/70" />
                    <div className="mt-2 h-4 w-20 rounded bg-white/60" />
                  </div>
                </div>

                {/* Content Skeleton */}
                <div className="p-6">
                  <div className="h-7 w-4/5 animate-pulse rounded-lg bg-slate-200" />

                  <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-orange-100" />

                  <div className="mt-5 flex gap-2">
                    <div className="h-4 w-4 rounded-full bg-slate-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <div className="h-9 w-20 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-9 w-20 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-9 w-28 animate-pulse rounded-full bg-slate-100" />
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#F3F4F6] pt-5">
                    <div className="h-11 w-32 animate-pulse rounded-2xl bg-slate-200" />

                    <div className="flex gap-2">
                      <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-100" />
                      <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {listings.slice(0, 3).map((listing, index) => (
                <motion.div
                  key={listing.id}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="group overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.10)]"
                >
                  <div className="relative h-[220px] overflow-hidden">
                    <img
                      src={listing.thumbnail}
                      alt={listing.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      {listing.badges1?.slice(0, 2).map((badge, idx) => (
                        <span
                          key={idx}
                          className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                            badge.display === "PC"
                              ? "bg-[#F97316] text-white"
                              : "bg-white/90 text-[#111827]"
                          }`}
                        >
                          {badge.text}
                        </span>
                      ))}
                    </div>

                    <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md">
                      <Heart size={15} />
                    </button>

                    <div className="absolute bottom-5 left-5">
                      <p className="text-2xl font-bold text-white">
                        {listing.lp_dol_text}
                      </p>
                      <p className="mt-1 text-sm text-white/90">
                        {listing.product_types}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-700 text-white">
                    <h3 className="line-clamp-1 text-xl font-bold ">
                      {listing.title}
                    </h3>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                      By {listing.developer_name}
                    </p>

                    <div className="mt-2 flex items-start gap-2">
                      <MapPin size={16} className="mt-1 text-[#edf1f8]" />
                      <p className="line-clamp-2 text-sm leading-6 text-[#bdcdeb]">
                        {listing.addr}, {listing.community}
                      </p>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="flex items-center gap-2 rounded-full bg-[#F7F8FA] px-3 py-2 text-xs font-medium text-[#4B5563]">
                        <BedDouble size={13} />
                        Luxury
                      </span>

                      <span className="flex items-center gap-2 rounded-full bg-[#F7F8FA] px-3 py-2 text-xs font-medium text-[#4B5563]">
                        <Bath size={13} />
                        Premium
                      </span>

                      <span className="flex items-center gap-2 rounded-full bg-[#F7F8FA] px-3 py-2 text-xs font-medium text-[#4B5563]">
                        <MoveHorizontal size={13} />
                        {listing.sqft} - {listing.sqft_max} sqft
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-[#F3F4F6] pt-2">
                      <button
                        onClick={() => {
                          sessionStorage.setItem("PG", JSON.stringify(listing));
                          router.push("/preconstruction/project");
                        }}
                        className="flex items-center gap-2 rounded-2xl bg-[#081A3A] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#102752]"
                      >
                        View Details
                        <ChevronRight size={16} />
                      </button>

                      <div className="flex items-center gap-2">
                        <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E5E7EB] text-[#6B7280] hover:border-[#F97316] hover:text-[#F97316]">
                          <Share2 size={15} />
                        </button>

                        <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E5E7EB] text-[#6B7280] hover:border-[#F97316] hover:text-[#F97316]">
                          <Heart size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex justify-center md:hidden">
              <Link
                href="/preconstruction"
                className="rounded-2xl border border-[#F97316] px-6 py-3 text-sm font-semibold text-[#F97316]"
              >
                View All Projects
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
