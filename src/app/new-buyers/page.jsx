"use client";

import { useState } from "react";
import { Building2, MapPinned, ChevronDown, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function NewBuyersPage() {
  const [budget, setBudget] = useState(450000);
  const [beds, setBeds] = useState(3);

  return (
    <main className="min-h-screen bg-[#F7F8FA] mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-xl font-bold tracking-tight text-[#111827]">
            For New Buyers
          </h1>

          <div className="mt-8 bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <p className="text-sm leading-8 text-[#4B5563] max-w-5xl">
              Discover a wealth of pre-construction projects on Listo, where we
              collaborate directly with developers to curate the most
              comprehensive and valuable information for our users. Gain
              exclusive insights and access to a diverse range of upcoming
              developments, ensuring you stay ahead in the real estate market.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* What Can I Get */}
          <div className="bg-white rounded-[32px] border border-[#E5E7EB] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col min-h-[650px]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] flex items-center justify-center">
                <Building2 size={22} />
              </div>

              <h2 className="text-xl font-bold text-[#111827]">
                What Can I Get?
              </h2>
            </div>

            {/* Budget */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#6B7280]">
                  Your Budget Range
                </span>

                <span className="text-lg font-bold text-[#F97316]">
                  ${budget.toLocaleString()}
                </span>
              </div>

              <input
                type="range"
                min="100000"
                max="2000000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#F97316]"
              />

              <div className="flex justify-between mt-2 text-xs text-[#9CA3AF]">
                <span>$100K</span>
                <span>$2M+</span>
              </div>
            </div>

            {/* Property */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#6B7280] mb-3">
                Property Type
              </label>

              <button className="w-full h-12 rounded-2xl border border-[#E5E7EB] px-2 flex items-center justify-between bg-[#FAFAFA] hover:bg-white transition">
                <span className="font-medium text-[#374151]">
                  Multi-family Residential
                </span>

                <ChevronDown size={18} />
              </button>
            </div>
            <div className="flex-1" />
            <Link
              href="/where-i-can-get"
              className="w-full h-12 rounded-full bg-[#081A3A] text-white flex items-center justify-center text-sm font-medium"
            >
              View Opportunities
            </Link>
          </div>

          {/* Where Can I Get */}
          <div className="bg-white rounded-[32px] border border-[#E5E7EB] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col min-h-[650px]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] flex items-center justify-center">
                <MapPinned size={22} />
              </div>

              <h2 className="text-xl font-bold text-[#111827]">
                Where Can I Get?
              </h2>
            </div>

            {/* Budget */}
            <div>
              <div className="flex items-center justify-between mb-2 ">
                <span className="text-sm font-medium text-[#6B7280]">
                  Your Budget Range
                </span>

                <span className="text-lg font-bold text-[#F97316]">
                  ${budget.toLocaleString()}
                </span>
              </div>

              <input
                type="range"
                min="100000"
                max="2000000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#F97316]"
              />

              <div className="flex justify-between mt-2 text-xs text-[#9CA3AF]">
                <span>$100K</span>
                <span>$2M+</span>
              </div>
            </div>

            {/* Beds */}
            <div className="mt-10">
              <label className="block text-sm font-medium text-[#6B7280] mb-4">
                Beds
              </label>

              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <button
                    key={item}
                    onClick={() => setBeds(item)}
                    className={`h-10 rounded-2xl font-semibold transition-all
                      ${
                        beds === item
                          ? "bg-[#F97316] text-white shadow-lg"
                          : "bg-white border border-[#E5E7EB] text-[#374151]"
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] border border-[#FED7AA] p-6">
              <div className="flex items-center gap-3">
                <BarChart3 size={20} className="text-[#F97316]" />

                <h3 className="font-semibold text-[#111827]">Market Insight</h3>
              </div>

              <p className="text-sm text-[#6B7280] leading-7">
                Based on your selected budget and bedroom count, we'll identify
                locations that provide the highest value and strongest
                appreciation potential.
              </p>
            </div>
            <div className="flex-1" />
            <Link
              href="/what-i-can-get"
              className="w-full h-12 rounded-full bg-[#081A3A] text-white flex items-center justify-center text-sm font-medium"
            >
              View Opportunities
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
