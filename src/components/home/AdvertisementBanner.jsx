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
            className="h-[240px] w-full object-cover sm:h-[320px] lg:h-[420px]"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />

          {/* AD TAG */}
          <div className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-[11px] font-bold tracking-wide text-black shadow-md">
            AD
          </div>

          {/* CONTENT */}
          <div className="absolute inset-0 flex items-end">
            <div className="p-6 sm:p-10 lg:p-14">
              {/* SPONSORED */}
              <p className="text-[11px] font-semibold uppercase tracking-[2px] text-white/70">
                Sponsored
              </p>

              {/* TITLE */}
              <h2 className="mt-3 max-w-[520px] text-[30px] font-extrabold leading-[38px] tracking-[-1px] text-white sm:text-[42px] sm:leading-[50px] lg:text-[54px] lg:leading-[62px]">
                Your ad could live here
              </h2>

              {/* DESCRIPTION */}
              <p className="mt-4 max-w-[520px] text-[14px] leading-[26px] text-white/80 sm:text-[16px]">
                Reach thousands of Canadian home buyers every day on LISTO.
              </p>

              {/* BUTTON */}
              <Link
                href="/advertise"
                className="mt-6 inline-flex items-center rounded-full bg-[#F58233] px-6 py-3 text-[14px] font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#e46f1d]"
              >
                Advertise with us ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
