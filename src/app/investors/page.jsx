// src/components/home/InvestorListings.jsx

"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";

const cities = [
  {
    name: "Toronto",
    count: 1107,
  },
  {
    name: "Dubai",
    count: 847,
  },
  {
    name: "New York",
    count: 532,
  },
  {
    name: "London",
    count: 420,
  },
];

export default function InvestorListings() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  return (
    <div className="container mx-auto">
      <section className="w-full bg-[#f5f5f5] py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          {/* HEADER */}
          <div className="max-w-5xl">
            {/* TITLE */}
            <h2 className="text-[34px] font-black tracking-[-0.04em] text-[#0B132B] lg:text-[42px]">
              Listings For Investors And Developers
            </h2>

            {/* DESCRIPTION BOX */}
            <div className="mt-6 rounded-[18px] border border-neutral-200 bg-white px-6 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <p className="text-[15px] leading-7 text-neutral-600">
                Discover Lucrative Properties: Listo’s cutting-edge algorithm
                identifies investment opportunities tailored for both investors
                and developers. Our platform compares property listings against
                Minimum-Maximum sold prices, analyzing factors such as lot size
                to pinpoint the most profitable deals for you.
              </p>
            </div>
          </div>

          {/* CARD */}
          <div className="mt-10 max-w-[720px] rounded-[26px] bg-[#03132D] p-7 shadow-[0_18px_50px_rgba(3,19,45,0.18)]">
            {/* LABEL */}
            <h3 className="text-[28px] font-black tracking-[-0.03em] text-white">
              View Listings in:
            </h3>

            {/* SELECT */}
            <div className="relative mt-6">
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const city = cities.find(
                    (item) => item.name === e.target.value
                  );

                  setSelectedCity(city);
                }}
                className="h-[58px] w-full appearance-none rounded-xl border border-[#F36B22]/30 bg-gradient-to-r from-[#F36B22] to-[#ff8747] px-5 pr-14 text-[15px] font-bold text-white outline-none transition-all focus:border-white"
              >
                {cities.map((city, index) => (
                  <option key={index} value={city.name} className="text-black">
                    {city.name} [{city.count}]
                  </option>
                ))}
              </select>

              {/* ICON */}
              <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white">
                <ChevronDown size={20} />
              </div>
            </div>

            {/* BUTTON */}
            <div className="mt-8 flex justify-center">
              <button className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-bold tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:border-[#F36B22] hover:bg-[#F36B22]">
                View
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>

            {/* FOOTER TEXT */}
            <div className="mt-8 flex items-center justify-center gap-2 text-center">
              <Sparkles size={14} className="text-[#F36B22]" />

              <p className="text-[13px] font-medium text-[#F36B22]">
                Compare listings against Minimum-Maximum sold by lot size.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
