// app/buildings/page.jsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  Home,
} from "lucide-react";

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/buildings");

      const data = await res.json();

      setBuildings(data?.rows || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* HERO */}
      <section
        className="relative h-[290px] overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2000')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#04122B]/95 via-[#04122B]/80 to-[#04122B]/40" />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1450px] items-center px-4 lg:px-8">
          <div>
            <h1 className="text-[40px] font-black tracking-[-0.04em] text-white lg:text-[54px]">
              Top Buildings in
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <h2 className="text-[28px] font-black text-[#F36B22] lg:text-[38px]">
                Toronto
              </h2>

              <button className="flex items-center gap-2 rounded-full border border-[#F36B22]/20 bg-[#F36B22]/10 px-4 py-2 text-sm font-bold text-white">
                [193]
                <ChevronDown size={16} />
              </button>
            </div>

            {/* TABS */}
            <div className="mt-7 flex items-center gap-3">
              <button className="rounded-full bg-[#F36B22] px-5 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">
                Sale
              </button>

              <button className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                Lease
              </button>

              <button className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                Sold
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="relative z-20 -mt-7">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-4 rounded-[20px] border border-neutral-200 bg-white px-5 py-4 shadow-[0_15px_35px_rgba(0,0,0,0.08)]">
          <select className="h-[46px] min-w-[150px] rounded-xl border border-neutral-200 px-4 text-sm font-semibold outline-none">
            <option>Toronto</option>
          </select>

          <select className="h-[46px] min-w-[140px] rounded-xl border border-neutral-200 px-4 text-sm font-semibold outline-none">
            <option>Any</option>
          </select>

          <select className="h-[46px] min-w-[140px] rounded-xl border border-neutral-200 px-4 text-sm font-semibold outline-none">
            <option>Any</option>
          </select>

          <select className="h-[46px] min-w-[180px] rounded-xl border border-neutral-200 px-4 text-sm font-semibold outline-none">
            <option>Property Type</option>
          </select>

          <button className="h-[46px] rounded-xl border border-neutral-200 px-5 text-sm font-bold text-neutral-700">
            Reset
          </button>

          <button className="h-[46px] rounded-xl bg-gradient-to-r from-[#F36B22] to-[#ff8c4d] px-7 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_10px_25px_rgba(243,107,34,0.35)]">
            Apply Filters
          </button>
        </div>
      </section>

      {/* BUILDINGS */}
      <section className="py-14">
        <div className="mx-auto max-w-[1450px] px-4 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-[360px] animate-pulse rounded-[24px] bg-neutral-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {buildings.map((building, index) => (
                <Link href={`/buildings/${building.addr_slug}`}>
                  <div
                    key={index}
                    className="group overflow-hidden rounded-[22px] bg-[#07152E] shadow-[0_15px_45px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(0,0,0,0.18)]"
                  >
                    {/* IMAGE */}
                    <div className="relative h-[235px] overflow-hidden">
                      <img
                        src={
                          building.thumbnail ||
                          "/images/placeholder/building.jpg"
                        }
                        alt={building.addr}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                      {/* COMING SOON */}
                      {!building.thumbnail && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-2xl font-black text-white/70">
                            coming soon
                          </p>
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      {/* TITLE */}
                      <h3 className="line-clamp-1 text-[22px] font-black tracking-[-0.03em] text-white">
                        {building.addr}
                      </h3>

                      {/* STATS */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                          {building.count_total} For Sale
                        </div>

                        <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                          {building.count_lease} For Lease
                        </div>
                      </div>

                      {/* FOOTER */}
                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                        {/* BUTTON */}
                        <Link
                          href={`/buildings/${building.addr_slug}`}
                          className="rounded-full bg-gradient-to-r from-[#F36B22] to-[#ff8c4d] px-5 py-2 text-xs font-black uppercase tracking-[0.12em] text-white"
                        >
                          Details →
                        </Link>

                        {/* ICONS */}
                        <div className="flex items-center gap-3 text-neutral-400">
                          <Building2 size={16} />

                          <Home size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          <div className="mt-14 flex items-center justify-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white transition-all hover:border-[#F36B22] hover:text-[#F36B22]">
              <ChevronLeft size={18} />
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white transition-all hover:border-[#F36B22] hover:text-[#F36B22]">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
