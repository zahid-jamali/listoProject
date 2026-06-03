// app/buildings/[slug]/page.jsx

"use client";

import { useEffect, useState } from "react";
import { ChevronDown, BedDouble, Bath } from "lucide-react";
import { useParams } from "next/navigation";

export default function BuildingPage() {
  const params = useParams();
  const slug = params.slug;

  const [building, setBuilding] = useState(null);
  const [stats, setStats] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [chart, setChart] = useState([]);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      const [buildingRes, statsRes, monthlyRes, chartRes] = await Promise.all([
        fetch(`/api/buildings/${slug}`),
        fetch(`/api/buildings/${slug}/stats`),
        fetch(`/api/buildings/${slug}/monthly`),
        fetch(`/api/buildings/${slug}/chart`),
      ]);

      const buildingData = await buildingRes.json();
      const statsData = await statsRes.json();
      const monthlyData = await monthlyRes.json();
      const chartData = await chartRes.json();

      setBuilding(buildingData);
      setStats(statsData);
      setMonthly(monthlyData?.rows || []);
      setChart(chartData?.rows || []);
    } catch (error) {
      console.log(error);
    }
  };

  if (!building) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#F36B22] border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] py-10">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        {/* HERO */}
        <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
            {/* IMAGE */}
            <div className="relative h-[340px] overflow-hidden">
              <img
                src={
                  building?.thumbnail ||
                  "https://listo.ca/images/placeholder/building.jpg"
                }
                alt={building?.addr}
                className="h-full w-full object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* TITLE */}
              <div className="absolute bottom-7 left-7">
                <h1 className="max-w-[700px] text-[34px] font-black leading-tight tracking-[-0.04em] text-white lg:text-[42px]">
                  {building?.addr}
                </h1>

                <p className="mt-2 text-sm text-white/70">Toronto, Ontario</p>
              </div>
            </div>

            {/* RIGHT STATS */}
            <div className="space-y-4 bg-[#fafafa] p-5">
              {/* LEASE */}
              <div className="rounded-[18px] border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                  Leases
                </p>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-[34px] font-black text-[#0B132B]">
                      $2.4M
                    </h3>

                    <p className="text-xs text-neutral-500">Avg Lease Price</p>
                  </div>

                  <div className="text-right">
                    <h4 className="text-2xl font-black text-[#F36B22]">99</h4>

                    <p className="text-xs text-neutral-500">Listings</p>
                  </div>
                </div>
              </div>

              {/* SALES */}
              <div className="rounded-[18px] border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                  Sales
                </p>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-[34px] font-black text-[#0B132B]">
                      $850K
                    </h3>

                    <p className="text-xs text-neutral-500">Avg Sale Price</p>
                  </div>

                  <div className="text-right">
                    <h4 className="text-2xl font-black text-[#F36B22]">45</h4>

                    <p className="text-xs text-neutral-500">Listings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABLES */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* LEASE TABLE */}
          <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            {/* HEADER */}
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="text-[28px] font-black text-[#0B132B]">
                Properties for Lease
              </h2>
            </div>

            {/* TABLE */}
            <div className="p-6">
              <table className="w-full overflow-hidden rounded-xl">
                <thead className="bg-[#07152E] text-white">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-black">
                      Bedrooms
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-black">
                      Listings
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-black">
                      Avg Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {[1, 2, 3, 4].map((item) => (
                    <tr key={item} className="border-b border-neutral-100">
                      <td className="px-5 py-4 text-sm font-semibold text-neutral-700">
                        Studio
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-neutral-700">
                        7
                      </td>

                      <td className="px-5 py-4 text-sm font-black text-[#F36B22]">
                        $2,900 / Mo.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* BUTTON */}
              <div className="mt-6 flex justify-center">
                <button className="rounded-full bg-gradient-to-r from-[#F36B22] to-[#ff8c4d] px-6 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">
                  View More Details →
                </button>
              </div>
            </div>
          </div>

          {/* SALE TABLE */}
          <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            {/* HEADER */}
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="text-[28px] font-black text-[#0B132B]">
                Properties for Sale
              </h2>
            </div>

            {/* TABLE */}
            <div className="p-6">
              <table className="w-full overflow-hidden rounded-xl">
                <thead className="bg-[#07152E] text-white">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-black">
                      Bedrooms
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-black">
                      Listings
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-black">
                      Avg Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {[1, 2, 3, 4].map((item) => (
                    <tr key={item} className="border-b border-neutral-100">
                      <td className="px-5 py-4 text-sm font-semibold text-neutral-700">
                        2
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-neutral-700">
                        8
                      </td>

                      <td className="px-5 py-4 text-sm font-black text-[#F36B22]">
                        $780K
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* BUTTON */}
              <div className="mt-6 flex justify-center">
                <button className="rounded-full bg-gradient-to-r from-[#F36B22] to-[#ff8c4d] px-6 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">
                  View More Details →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="mt-10 rounded-[24px] bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-[30px] font-black text-[#0B132B]">
                Price By Bedrooms
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Average pricing per bedroom over time
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="rounded-full bg-[#F36B22] px-4 py-2 text-xs font-black uppercase text-white">
                Sale
              </button>

              <button className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-black uppercase text-neutral-700">
                Lease
              </button>
            </div>
          </div>

          {/* GRAPH */}
          <div className="relative h-[320px] overflow-hidden rounded-[20px] border border-neutral-200 bg-gradient-to-b from-[#fff7f2] to-white p-8">
            {/* LINES */}
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="border-t border-dashed border-neutral-200"
                />
              ))}
            </div>

            {/* GRAPH LINE */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="#F36B22"
                strokeWidth="0.8"
                points="
                  5,80
                  15,75
                  25,78
                  35,65
                  45,68
                  55,52
                  65,45
                  75,48
                  85,25
                  95,15
                "
              />

              <circle cx="85" cy="25" r="1.8" fill="#111" />
            </svg>

            {/* TOOLTIP */}
            <div className="absolute right-[80px] top-[90px] rounded-lg bg-black px-3 py-2 text-xs font-bold text-white shadow-xl">
              $1.2M
            </div>
          </div>
        </div>

        {/* RECENT */}
        <div className="mt-10 rounded-[24px] bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[30px] font-black text-[#0B132B]">
                Recent Sold/Leased
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                at {building?.addr}
              </p>
            </div>

            {/* FILTERS */}
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-neutral-200 px-5 py-2 text-xs font-black uppercase text-neutral-700">
                Sold
              </button>

              <button className="rounded-full bg-[#F36B22] px-5 py-2 text-xs font-black uppercase text-white">
                Leased
              </button>

              <button className="rounded-full border border-neutral-200 px-5 py-2 text-xs font-black uppercase text-neutral-700">
                Everything
              </button>
            </div>
          </div>

          {/* LIST */}
          <div className="space-y-4">
            {monthly.length > 0
              ? monthly.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-[18px] bg-[#07152E] p-5 text-white shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      {/* LEFT */}
                      <div>
                        <h3 className="text-lg font-black">
                          {item.addr || "Unit 1205"}
                        </h3>

                        <p className="mt-2 text-sm text-neutral-300">
                          {item.lp_dol_text || "$899,000"}
                        </p>
                      </div>

                      {/* BADGE */}
                      <div className="rounded-full bg-[#F36B22] px-4 py-2 text-xs font-black uppercase tracking-[0.12em]">
                        Leased
                      </div>
                    </div>
                  </div>
                ))
              : [1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] bg-[#07152E] p-5 text-white shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-black">Unit 1205</h3>

                        <p className="mt-2 text-sm text-neutral-300">
                          $899,000
                        </p>
                      </div>

                      <div className="rounded-full bg-[#F36B22] px-4 py-2 text-xs font-black uppercase tracking-[0.12em]">
                        Leased
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </main>
  );
}
