"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Home,
  MapPin,
  Search,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const LIMIT = 20;
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [areaSlug, setAreaSlug] = useState("toronto");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBuildings();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, areaSlug, page]);

  const fetchBuildings = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        area_slug: areaSlug,
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
        incl_total: 1,
      });

      if (search.trim()) {
        params.append("search", search);
      }

      const res = await fetch(`/api/buildings?${params.toString()}`);
      const data = await res.json();

      setBuildings(data?.rows || []);
      setTotal(Number(data?.total || 0));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  const pages = [];

  for (
    let i = Math.max(1, page - 2);
    i <= Math.min(totalPages, page + 2);
    i++
  ) {
    pages.push(i);
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#081A3A]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#F97316] blur-[120px]" />
          <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-blue-500 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-28 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              Premium Buildings Directory
            </span>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              Discover Toronto's
              <span className="block text-[#F97316]">
                Most Popular Buildings
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75">
              Browse condos, luxury towers, investment buildings and exclusive
              communities with real-time listing availability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="relative z-10 -mt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[32px] border border-[#E5E7EB] bg-white p-6 shadow-[0_25px_60px_rgba(0,0,0,0.08)]"
          >
            <div className="grid gap-4 lg:grid-cols-6">
              <div className="relative lg:col-span-2">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  placeholder="Search buildings..."
                  className="h-14 w-full rounded-2xl border border-[#E5E7EB] pl-12 pr-4 text-sm outline-none focus:border-[#F97316]"
                />
              </div>

              <select
                value={areaSlug}
                onChange={(e) => {
                  setPage(1);
                  setAreaSlug(e.target.value);
                }}
                className="h-14 rounded-2xl border border-[#E5E7EB] px-4 text-sm font-medium outline-none focus:border-[#F97316]"
              >
                <option value="toronto">Toronto</option>
                <option value="york">York</option>
                <option value="peel">Peel</option>
                <option value="halton">Halton</option>
                <option value="hamilton">Hamilton</option>
                <option value="durham">Durham</option>
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 lg:grid-cols-4 lg:px-10">
          {[
            [total.toLocaleString(), "Buildings"],
            [
              buildings
                .reduce((sum, b) => sum + Number(b.count_total || 0), 0)
                .toLocaleString(),
              "Listings",
            ],
            [
              buildings.filter((b) => Number(b.count_sale) > 0).length,
              "For Sale",
            ],
            [
              buildings.filter((b) => Number(b.count_lease) > 0).length,
              "For Lease",
            ],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 text-center"
            >
              <h3 className="text-3xl font-bold text-[#111827]">{value}</h3>
              <p className="mt-2 text-sm text-[#6B7280]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BUILDINGS */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-[420px] animate-pulse rounded-[32px] bg-white"
                />
              ))}
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            >
              {!loading && buildings.length === 0 && (
                <div className="col-span-full rounded-[32px] border border-[#E5E7EB] bg-white p-16 text-center">
                  <Building2 className="mx-auto mb-4 h-12 w-12 text-[#9CA3AF]" />
                  <h3 className="text-xl font-semibold text-[#111827]">
                    No buildings found
                  </h3>
                  <p className="mt-2 text-[#6B7280]">
                    Try changing your search or filters.
                  </p>
                </div>
              )}

              {buildings.map((building, index) => (
                <motion.div variants={item} key={building.addr_slug || index}>
                  <Link href={`/buildings/${building.addr_slug}`}>
                    <div className="group overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.12)]">
                      <div className="relative h-[260px] overflow-hidden">
                        <img
                          src={
                            building.thumbnail &&
                            !building.thumbnail.includes("placeholder")
                              ? building.thumbnail
                              : "/assets/buildings.png"
                          }
                          alt={building.addr}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#111827] backdrop-blur-md">
                          Featured Building
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="line-clamp-1 text-xl font-bold text-[#111827]">
                          {building.addr || building.title}
                        </h3>

                        <div className="mt-3 flex items-center gap-2 text-sm text-[#6B7280]">
                          <MapPin size={15} />
                          {building.munc_slug?.replace(/-/g, " ")},{" "}
                          {building.county?.toUpperCase()}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#FFF7ED] px-3 py-2 text-xs font-medium text-[#F97316]">
                            {building.count_sale} For Sale
                          </span>

                          <span className="rounded-full bg-[#EFF6FF] px-3 py-2 text-xs font-medium text-blue-700">
                            {building.count_lease} For Lease
                          </span>
                          <span className="rounded-full bg-[#F5F3FF] px-3 py-2 text-xs font-medium text-purple-700">
                            {building.count_total} Total
                          </span>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-[#F3F4F6] pt-5">
                          <div className="flex items-center gap-2 text-sm font-semibold text-[#081A3A]">
                            View Details
                            <ChevronRight size={16} />
                          </div>

                          <div className="flex gap-3 text-[#9CA3AF]">
                            <Building2 size={16} />
                            <Home size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-2 disabled:opacity-50"
              >
                Previous
              </button>

              {pages.map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-11 w-11 rounded-xl font-semibold ${
                    p === page
                      ? "bg-[#081A3A] text-white"
                      : "border border-[#E5E7EB]"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
