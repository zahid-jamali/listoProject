// src/components/home/PopularCities.jsx

"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const cities = [
  {
    name: "Toronto",
    listings: "12,400+",
    image: "/assets/toronto.png",
    bg: "bg-[#F6EEE3]",
  },
  {
    name: "Vaughan",
    listings: "3,200+",
    image: "/assets/vaughan.png",

    bg: "bg-[#F8F1D9]",
  },
  {
    name: "Brampton",
    listings: "8,100+",
    image: "/assets/brampton.png",
    bg: "bg-[#E8F2FA]",
  },
  {
    name: "Markham",
    listings: "5,600+",
    image: "/assets/markham.png",
    bg: "bg-[#E8F0FA]",
  },
  {
    name: "Stouffville",
    listings: "2,900+",
    image: "/assets/stouffville.png",
    bg: "bg-[#F9E9EC]",
  },
  {
    name: "Ajax",
    listings: "4,100+",
    image: "/assets/ajax.png",
    bg: "bg-[#E6F6EE]",
  },
  {
    name: "Mississauga",
    listings: "4,100+",
    image: "/assets/mississauga.png",
    bg: "bg-[#57D6E8]",
  },
  {
    name: "Oakville",
    listings: "4,100+",
    image: "/assets/oakville.png",
    bg: "bg-[#8D96F0]",
  },
];

export default function PopularCities() {
  return (
    <section className="w-full bg-[#f7f7f7] py-16 lg:py-20">
      <div className="container m-auto">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[34px] font-extrabold tracking-[-1px] text-black lg:text-[42px]">
                Popular Cities
              </h2>

              <p className="mt-2 text-[15px] text-neutral-500">
                Explore properties across top Canadian cities
              </p>
            </div>

            <Link
              href="/cities"
              className="hidden items-center gap-2 text-[15px] font-semibold text-[#F58233] transition-all duration-300 hover:gap-3 md:flex"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* CITIES GRID */}
          <div className="mt-10  grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {cities.map((city, index) => (
              <Link
                href={`/city/${city.name.toLowerCase()}`}
                key={index}
                className="group"
              >
                {/* CARD */}
                <div className="flex flex-col items-center">
                  {/* IMAGE BOX */}
                  <div
                    className={`relative flex h-[120px] w-full max-w-[120px] items-center justify-center overflow-hidden rounded-[18px] border border-neutral-200 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${city.bg}`}
                  >
                    {/* GLOW EFFECT */}
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
                    </div>

                    {/* IMAGE */}
                    <img
                      src={city.image}
                      alt={city.name}
                      className="relative z-10 h-[52px] w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* CITY NAME */}
                  <h3 className="mt-4 text-center text-[18px] font-bold tracking-[-0.4px] text-black transition-colors duration-300 group-hover:text-[#F58233]">
                    {city.name}
                  </h3>

                  {/* LISTINGS */}
                  <p className="mt-1 text-[13px] font-medium text-neutral-500">
                    {city.listings}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* MOBILE BUTTON */}
          <div className="mt-10 flex justify-center md:hidden">
            <Link
              href="/cities"
              className="flex items-center gap-2 rounded-xl border border-[#F58233] px-6 py-3 text-[15px] font-semibold text-[#F58233]"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
