// src/components/home/AdvertisementBanner.jsx

"use client";

import Link from "next/link";

export default function AdvertisementBanner() {
  return (
    <section className="w-full bg-[#f7f7f7] py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
        {/* BANNER */}
        <div className="relative overflow-hidden rounded-[32px]">
          {/* BACKGROUND IMAGE */}
          <img
            src="/assets/ad-banner.png" // set your image path
            alt="Advertisement Banner"
            className="min-h-[260px] sm:min-h-[320px] lg:h-[420px] w-full object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />

          {/* AD TAG */}
          <div className="absolute right-4 top-4 sm:right-5 sm:top-5 rounded-full bg-white px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wide text-black shadow-md">
            AD
          </div>

          {/* CONTENT */}
          <div className="absolute inset-0 flex items-end">
            <div className="p-5 sm:p-10 lg:p-14">
              {/* SPONSORED */}
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[2px] text-white/70">
                Sponsored
              </p>

              {/* TITLE */}
              <h2 className="mt-1.5 sm:mt-3 max-w-[520px] text-2xl font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-[42px] sm:leading-[50px] lg:text-[54px] lg:leading-[62px]">
                Your ad could live here
              </h2>

              {/* DESCRIPTION */}
              <p className="mt-2 sm:mt-4 max-w-[520px] text-xs leading-5 text-white/85 sm:text-[16px] sm:leading-[26px]">
                Reach thousands of Canadian home buyers every day on LISTO.
              </p>

              {/* BUTTON */}
              <Link
                href="/advertise"
                className="mt-4 sm:mt-6 inline-flex items-center rounded-full bg-[#F58233] px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-[14px] font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#e46f1d]"
              >
                Advertise
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
