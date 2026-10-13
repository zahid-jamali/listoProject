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
} from "lucide-react";
import { getBuildingUrl, stashBuilding } from "@/lib/building-url";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function titleize(slug = "") {
  return String(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function buildingThumb(building) {
  const t = building?.thumbnail;
  if (t && !String(t).includes("placeholder")) {
    return t.startsWith("http") ? t : `https://listo.ca${t}`;
  }
  return "/assets/buildings.png";
}

const LIMIT = 24;

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [areaSlug, setAreaSlug] = useState("toronto");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/buildings/picklist");
        const data = await res.json();
        const rows = Array.isArray(data) ? data : data?.rows || [];
        if (!cancelled) {
          setAreas(
            rows
              .filter((r) => r?.area_slug)
              .map((r) => ({
                slug: r.area_slug,
                name: titleize(r.area_slug),
                count: Number(r.count || 0),
              })),
          );
        }
      } catch {
        if (!cancelled) setAreas([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        area_slug: areaSlug,
        limit: String(LIMIT),
        offset: String((page - 1) * LIMIT),
        incl_total: "1",
        sort: "count_total",
        order: "desc",
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/buildings?${params}`);
      const data = await res.json();
      setBuildings(Array.isArray(data?.rows) ? data.rows : []);
      setTotal(Number(data?.total || 0));
    } catch (err) {
      console.log(err);
      setBuildings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBuildings();
    }, 350);
    return () => clearTimeout(timer);
  }, [search, areaSlug, page]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const pages = [];
  for (
    let i = Math.max(1, page - 2);
    i <= Math.min(totalPages, page + 2);
    i++
  ) {
    pages.push(i);
  }

  const openBuilding = (building) => {
    stashBuilding(building);
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#081A3A]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#F97316] blur-[120px]" />
          <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-blue-500 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              Premium Buildings Directory
            </span>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ontario&apos;s
              <span className="block text-[#F97316]">
                Most Popular Condo Buildings
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Browse condos and towers with live sale and lease availability,
              bedroom price comps, and sold-price trends.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="relative z-10 -mt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[28px] border border-[#E5E7EB] bg-white p-4 shadow-[0_25px_60px_rgba(0,0,0,0.08)] sm:p-6"
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative sm:col-span-2">
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
                  placeholder="Search by address or building name…"
                  className="h-12 w-full rounded-2xl border border-[#E5E7EB] pl-12 pr-4 text-sm outline-none focus:border-[#F97316] sm:h-14"
                />
              </div>

              <select
                value={areaSlug}
                onChange={(e) => {
                  setPage(1);
                  setAreaSlug(e.target.value);
                }}
                className="h-12 rounded-2xl border border-[#E5E7EB] px-4 text-sm font-medium outline-none focus:border-[#F97316] sm:h-14"
              >
                {areas.length === 0 ? (
                  <option value={areaSlug}>{titleize(areaSlug)}</option>
                ) : (
                  areas.map((a) => (
                    <option key={a.slug} value={a.slug}>
                      {a.name} ({a.count.toLocaleString()})
                    </option>
                  ))
                )}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:gap-6 sm:px-6 lg:grid-cols-4 lg:px-10">
          {[
            [total.toLocaleString(), "Buildings"],
            [
              buildings
                .reduce((sum, b) => sum + Number(b.count_total || 0), 0)
                .toLocaleString(),
              "Active units",
            ],
            [
              buildings
                .reduce((sum, b) => sum + Number(b.count_sale || 0), 0)
                .toLocaleString(),
              "For Sale",
            ],
            [
              buildings
                .reduce((sum, b) => sum + Number(b.count_lease || 0), 0)
                .toLocaleString(),
              "For Lease",
            ],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 text-center sm:p-6"
            >
              <h3 className="text-2xl font-bold text-[#111827] sm:text-3xl">
                {value}
              </h3>
              <p className="mt-1 text-sm text-[#6B7280]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GRID */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-[380px] animate-pulse rounded-[28px] bg-white"
                />
              ))}
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
            >
              {buildings.length === 0 && (
                <div className="col-span-full rounded-[28px] border border-[#E5E7EB] bg-white p-12 text-center sm:p-16">
                  <Building2 className="mx-auto mb-4 h-12 w-12 text-[#9CA3AF]" />
                  <h3 className="text-xl font-semibold text-[#111827]">
                    No buildings found
                  </h3>
                  <p className="mt-2 text-[#6B7280]">
                    Try changing your search or area filter.
                  </p>
                </div>
              )}

              {buildings.map((building, index) => {
                const href = getBuildingUrl(building);
                const name =
                  building.title && building.title !== building.addr_slug
                    ? building.title
                    : building.addr;

                return (
                  <motion.div
                    variants={item}
                    key={building.addr_slug || index}
                  >
                    <Link
                      href={href}
                      onClick={() => openBuilding(building)}
                      className="group block overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.05)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(0,0,0,0.12)]"
                    >
                      <div className="relative h-[220px] overflow-hidden sm:h-[240px]">
                        <img
                          src={buildingThumb(building)}
                          alt={name}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="line-clamp-1 text-lg font-bold text-white">
                            {name}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/75">
                            <MapPin size={12} />
                            {titleize(building.munc_slug)},{" "}
                            {String(building.county || "ON").toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#FFF7ED] px-3 py-1.5 text-xs font-semibold text-[#F97316]">
                            {Number(building.count_sale || 0)} For Sale
                          </span>
                          <span className="rounded-full bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-blue-700">
                            {Number(building.count_lease || 0)} For Lease
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                            {Number(building.count_total || 0)} Total
                          </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-[#F3F4F6] pt-4">
                          <span className="flex items-center gap-1 text-sm font-semibold text-[#081A3A]">
                            View building
                            <ChevronRight size={16} />
                          </span>
                          <div className="flex gap-2 text-[#9CA3AF]">
                            <Building2 size={16} />
                            <Home size={16} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Previous
              </button>

              {pages.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-10 w-10 rounded-xl text-sm font-semibold ${
                    p === page
                      ? "bg-[#081A3A] text-white"
                      : "border border-[#E5E7EB] bg-white"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
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
