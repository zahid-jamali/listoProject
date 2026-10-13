"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import PreconstructionCard from "../PreconstructionCard";

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
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favoriteProjects")) || [];

    setFavorites(stored);
  }, []);



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
            href="/pre-construction-projects-by-area"
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
                <PreconstructionCard key={index} listing={listing} />
              ))}
            </div>

            <div className="mt-10 flex justify-center md:hidden">
              <Link
                href="/pre-construction-projects-by-area"
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
