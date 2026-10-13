"use client";

import { useState } from "react";
import { Building2, MapPinned, BarChart3, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const PROPERTY_TYPES = [
  { value: "", label: "All Residential Properties" },
  { value: "RES", label: "Detached, Semi & Townhomes" },
  { value: "CND", label: "Condos & Apartments" },
];

const CITIES = [
  { value: "toronto", label: "Toronto, ON" },
  { value: "mississauga", label: "Mississauga, ON" },
  { value: "brampton", label: "Brampton, ON" },
  { value: "vaughan", label: "Vaughan, ON" },
  { value: "markham", label: "Markham, ON" },
  { value: "oakville", label: "Oakville, ON" },
  { value: "hamilton", label: "Hamilton, ON" },
  { value: "ajax", label: "Ajax, ON" },
];

export default function NewBuyersPage() {
  const [whatBudget, setWhatBudget] = useState(850000);
  const [propertyType, setPropertyType] = useState("");
  const [whatCity, setWhatCity] = useState("toronto");

  const [whereBudget, setWhereBudget] = useState(850000);
  const [beds, setBeds] = useState(3);
  const [whereType, setWhereType] = useState("");

  const whatHref = `/real-estate-for-new-buyers/what-can-i-buy?pr_max=${whatBudget}&munc=${encodeURIComponent(whatCity)}${propertyType ? `&sub_type=${propertyType}` : ""}`;
  const whereHref = `/real-estate-for-new-buyers/where-can-i-buy?pr_max=${whereBudget}&br_min=${beds}${whereType ? `&sub_type=${whereType}` : ""}`;

  return (
    <main className="min-h-screen bg-[#F7F8FA] mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold text-[#F97316]">
            First-Time & New Buyer Tools
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            For New Buyers
          </h1>

          <div className="mt-6 bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <p className="text-sm sm:text-base leading-8 text-[#4B5563] max-w-5xl">
              Explore live Ontario MLS® inventory tailored to your budget. Whether you have a target city in mind and want to see what homes fit your budget, or you know how many bedrooms you need and want to discover the best cities you can afford, our interactive buyer tools connect directly to live market listings.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* What Can I Get */}
          <div className="bg-white rounded-[32px] border border-[#E5E7EB] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col min-h-[650px]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center">
                <Building2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#111827]">
                  What Can I Get?
                </h2>
                <p className="text-xs text-[#6B7280]">
                  See homes & condos available for your budget in your preferred city
                </p>
              </div>
            </div>

            {/* Budget */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#6B7280]">
                  Your Budget Range
                </span>

                <span className="text-lg font-bold text-[#F97316]">
                  Up to ${whatBudget.toLocaleString()}
                </span>
              </div>

              <input
                type="range"
                min="250000"
                max="2500000"
                step="25000"
                value={whatBudget}
                onChange={(e) => setWhatBudget(Number(e.target.value))}
                className="w-full accent-[#F97316]"
              />

              <div className="flex justify-between mt-2 text-xs text-[#9CA3AF]">
                <span>$250K</span>
                <span>$2.5M+</span>
              </div>
            </div>

            {/* Preferred City */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#6B7280] mb-2.5">
                Preferred City
              </label>

              <select
                value={whatCity}
                onChange={(e) => setWhatCity(e.target.value)}
                className="w-full h-12 rounded-2xl border border-[#E5E7EB] px-4 font-medium text-[#374151] bg-[#FAFAFA] hover:bg-white focus:border-[#F97316] outline-none transition"
              >
                {CITIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#6B7280] mb-2.5">
                Property Type
              </label>

              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full h-12 rounded-2xl border border-[#E5E7EB] px-4 font-medium text-[#374151] bg-[#FAFAFA] hover:bg-white focus:border-[#F97316] outline-none transition"
              >
                {PROPERTY_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8 rounded-3xl bg-slate-50 border border-slate-200/80 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 size={16} className="text-[#F97316]" />
                Live MLS® inventory filtered to your exact budget
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 size={16} className="text-[#F97316]" />
                Compare detached homes, townhomes & condos side-by-side
              </div>
            </div>

            <div className="flex-1" />
            <Link
              href={whatHref}
              className="mt-8 w-full h-12 rounded-full bg-[#081A3A] hover:bg-[#0d2756] transition text-white flex items-center justify-center text-sm font-semibold shadow-md"
            >
              View What I Can Buy →
            </Link>
          </div>

          {/* Where Can I Get */}
          <div className="bg-white rounded-[32px] border border-[#E5E7EB] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col min-h-[650px]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center">
                <MapPinned size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#111827]">
                  Where Can I Get?
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Discover Ontario cities that match your bedroom & price criteria
                </p>
              </div>
            </div>

            {/* Budget */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#6B7280]">
                  Your Budget Range
                </span>

                <span className="text-lg font-bold text-[#F97316]">
                  Up to ${whereBudget.toLocaleString()}
                </span>
              </div>

              <input
                type="range"
                min="250000"
                max="2500000"
                step="25000"
                value={whereBudget}
                onChange={(e) => setWhereBudget(Number(e.target.value))}
                className="w-full accent-[#F97316]"
              />

              <div className="flex justify-between mt-2 text-xs text-[#9CA3AF]">
                <span>$250K</span>
                <span>$2.5M+</span>
              </div>
            </div>

            {/* Beds */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#6B7280] mb-3">
                Minimum Bedrooms
              </label>

              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setBeds(item)}
                    className={`h-10 rounded-2xl font-semibold transition-all ${
                      beds === item
                        ? "bg-[#F97316] text-white shadow-lg"
                        : "bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#F97316]"
                    }`}
                  >
                    {item}+
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#6B7280] mb-2.5">
                Property Style
              </label>

              <select
                value={whereType}
                onChange={(e) => setWhereType(e.target.value)}
                className="w-full h-12 rounded-2xl border border-[#E5E7EB] px-4 font-medium text-[#374151] bg-[#FAFAFA] hover:bg-white focus:border-[#F97316] outline-none transition"
              >
                {PROPERTY_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8 rounded-3xl bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] border border-[#FED7AA] p-5">
              <div className="flex items-center gap-3">
                <BarChart3 size={20} className="text-[#F97316]" />
                <h3 className="font-semibold text-[#111827]">Market Insight</h3>
              </div>

              <p className="mt-1.5 text-xs sm:text-sm text-[#6B7280] leading-6">
                Based on your ${whereBudget.toLocaleString()} budget and {beds}+ bedrooms, we&apos;ll show you active listings across Ontario communities with the strongest value.
              </p>
            </div>

            <div className="flex-1" />
            <Link
              href={whereHref}
              className="mt-8 w-full h-12 rounded-full bg-[#081A3A] hover:bg-[#0d2756] transition text-white flex items-center justify-center text-sm font-semibold shadow-md"
            >
              View Where I Can Buy →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
