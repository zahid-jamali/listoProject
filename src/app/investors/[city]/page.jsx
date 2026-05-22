// src/app/investors/[city]/page.jsx

"use client";

import { useEffect, useState } from "react";
import {
  BedDouble,
  Bath,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function InvestorCityPage() {
  const params = useParams();
  const city = params?.city;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [city]);

  const fetchListings = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/get_inv_listings?search=${city}`);

      const data = await res.json();

      console.log(data);

      setProperties(data?.rows || []);
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
        className="relative h-[340px] overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#04122B]/95 via-[#04122B]/70 to-[#04122B]/20" />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1450px] items-center px-4 lg:px-8">
          <div>
            <h1 className="text-[42px] font-black tracking-[-0.04em] text-white lg:text-[58px]">
              Investor Listings in
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <h2 className="text-[28px] font-black capitalize text-[#F36B22] lg:text-[38px]">
                {city}
              </h2>

              <span className="rounded-full border border-[#F36B22]/30 bg-[#F36B22]/10 px-4 py-2 text-sm font-bold text-white">
                [1170]
              </span>
            </div>

            {/* FILTERS */}
            <div className="mt-8 flex items-center gap-3">
              <button className="rounded-full bg-[#F36B22] px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg">
                Investors
              </button>

              <button className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                Builders
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-14">
        <div className="mx-auto grid max-w-[1450px] grid-cols-1 gap-8 px-4 lg:grid-cols-[1fr_380px] lg:px-8">
          {/* LEFT */}
          <div>
            {/* LOADING */}
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[270px] animate-pulse rounded-[28px] bg-neutral-200"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(0,0,0,0.12)]"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_110px]">
                      {/* IMAGE */}
                      <div className="relative h-[260px] overflow-hidden">
                        <img
                          src={
                            property?.photos?.[0] ||
                            "https://placehold.co/600x400"
                          }
                          alt={property.addr}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                      </div>

                      {/* CONTENT */}
                      <div className="p-6">
                        {/* ADDRESS */}
                        <h3 className="line-clamp-2 text-[22px] font-black leading-tight tracking-[-0.03em] text-[#0B132B]">
                          {property.addr}
                        </h3>

                        {/* BADGES */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {property?.badges1?.map((badge, index) => (
                            <div
                              key={index}
                              className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700"
                            >
                              {badge.text}
                            </div>
                          ))}
                        </div>

                        {/* PRICE */}
                        <div className="mt-5">
                          <h4 className="text-[34px] font-black tracking-[-0.04em] text-[#F36B22]">
                            {property.lp_dol_text}
                          </h4>

                          <p className="mt-1 text-sm text-neutral-500">
                            Min-Max Sold:
                            <span className="ml-2 font-semibold text-neutral-700">
                              ${property.min_sold?.toLocaleString()} - $
                              {property.max_sold?.toLocaleString()}
                            </span>
                          </p>
                        </div>

                        {/* FEATURES */}
                        <div className="mt-5 flex items-center gap-5">
                          <div className="flex items-center gap-2 text-neutral-700">
                            <BedDouble size={18} />

                            <span className="text-sm font-semibold">
                              {property.br}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-neutral-700">
                            <Bath size={18} />

                            <span className="text-sm font-semibold">
                              {property.bath_tot}
                            </span>
                          </div>

                          <div className="rounded-full border border-[#F36B22]/20 bg-[#F36B22]/10 px-3 py-1 text-xs font-bold text-[#F36B22]">
                            LOT {property.front_ft} x {property.depth}
                          </div>
                        </div>

                        {/* DESCRIPTION */}
                        <p className="mt-5 line-clamp-3 text-[15px] leading-7 text-neutral-600">
                          {property.ad_text}
                        </p>
                      </div>

                      {/* RIGHT ACTIONS */}
                      <div className="flex flex-col justify-between bg-[#07152E] p-5">
                        {/* LOT */}
                        <div className="flex justify-center">
                          <div className="flex h-[78px] w-[78px] items-center justify-center rounded-xl border border-white/10 bg-white text-[14px] font-black text-[#07152E]">
                            LOT
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div>
                          <div className="mb-5 flex items-center justify-center gap-4">
                            <button className="text-neutral-400 transition-all hover:text-[#F36B22]">
                              <Heart size={18} />
                            </button>

                            <button className="text-neutral-400 transition-all hover:text-[#F36B22]">
                              <Share2 size={18} />
                            </button>
                          </div>

                          {/* BUTTON */}
                          <Link
                            href={property.access_url}
                            className="flex h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-[#F36B22] to-[#ff8c4d] text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_10px_25px_rgba(243,107,34,0.35)] transition-all hover:scale-105"
                          >
                            See Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION */}
            <div className="mt-12 flex items-center justify-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 transition-all hover:border-[#F36B22] hover:text-[#F36B22]">
                <ChevronLeft size={18} />
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 transition-all hover:border-[#F36B22] hover:text-[#F36B22]">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* RIGHT MAP */}
          <div className="sticky top-28 h-fit">
            <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.08)]">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
                alt="map"
                className="h-[900px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
