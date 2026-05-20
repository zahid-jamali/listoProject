// src/components/home/HeroSection.tsx

"use client";

import { Sparkles, Search } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative h-[720px] w-full overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center "
        style={{
          backgroundImage: "url('/assets/hero.png')", // set your image path
        }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/45" />

      {/* 
      


      {/* CONTENT */}
      {/* <Navbar /> */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center px-6 text-center">
        {/* HEADING */}
        <h1 className="max-w-[900px] text-[44px] font-extrabold leading-[52px] tracking-[-1px] text-white lg:text-[44px] lg:leading-[74px]">
          Find your next home in <span className="text-[#F58233]">Canada.</span>
        </h1>

        {/* SUBTITLE */}
        <p className="mt-4 text-[20px] font-medium text-white/90 lg:text-[22px]">
          12,000+ MLS listings. Smarter search powered by AI.
        </p>

        {/* SEARCH CARD */}
        <div className="mt-10 w-full max-w-[600px] rounded-[24px] bg-white p-2 shadow-2xl">
          {/* TOP TABS */}
          <div className="flex items-center justify-between">
            {/* LEFT TABS */}
            <div className="flex items-center gap-3">
              <button className="rounded-full bg-[#F58233] px-5 py-2 text-sm font-semibold text-white">
                Residential
              </button>

              <button className="text-sm font-medium text-neutral-500 transition-colors hover:text-black">
                Commercial
              </button>
            </div>

            {/* AI SEARCH */}
            <button className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-400">
              <Sparkles size={15} className="text-[#F58233]" />
              AI Search
            </button>
          </div>

          {/* SEARCH INPUT */}
          <div className="mt-4 flex h-[56px] items-center rounded-xl border border-neutral-200 bg-white px-4 shadow-sm">
            {/* SEARCH ICON */}
            <Search size={18} className="text-neutral-400" />

            {/* INPUT */}
            <input
              type="text"
              placeholder="Search Home and Condos"
              className="h-full flex-1 bg-transparent px-3 text-[15px] text-black placeholder:text-neutral-400 focus:outline-none"
            />

            {/* BUTTON */}
            <button className="rounded-lg bg-[#F58233] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e87420]">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
