"use client";

import { useState } from "react";
import Link from "next/link";
import { Home } from "lucide-react";

const provinces = [
  {
    name: "Ontario",
    listings: "5,000+",
    href: "/real-estate-listings",
  },
  {
    name: "GTA Pre-Construction",
    listings: "850+",
    href: "/pre-construction-projects-by-area",
  },
  {
    name: "Ontario Market Stats",
    listings: "Live Data",
    href: "/real-estate-market-stats",
  },
];

const cities = [
  {
    name: "Mississauga",
    slug: "mississauga",
    listings: 3778,
    image: "/cities/mississauga.jpg",
  },
  {
    name: "Toronto",
    slug: "toronto",
    listings: 1933,
    image: "/cities/toronto.jpg",
  },
  {
    name: "Vaughan",
    slug: "vaughan",
    listings: 1080,
    image: "/cities/vaughan.jpg",
  },
  {
    name: "Brampton",
    slug: "brampton",
    listings: 2981,
    image: "/cities/brampton.jpg",
  },
  {
    name: "Hamilton",
    slug: "hamilton",
    listings: 2003,
    image: "/cities/hamilton.jpg",
  },
  {
    name: "Welland",
    slug: "welland",
    listings: 438,
    image: "/cities/welland.jpg",
  },
  {
    name: "Markham",
    slug: "markham",
    listings: 1420,
    image: "/assets/markham.png",
  },
  {
    name: "Oakville",
    slug: "oakville",
    listings: 1150,
    image: "/assets/oakville.png",
  },
  {
    name: "Ajax",
    slug: "ajax",
    listings: 860,
    image: "/assets/ajax.png",
  },
];

export default function SitemapPage() {
  const [showAllCities, setShowAllCities] = useState(false);
  const visibleCities = showAllCities ? cities : cities.slice(0, 6);

  return (
    <main className="bg-[#ffffffe2] mx-auto min-h-screen max-w-7xl py-10 mt-20">
      <div className="mx-auto max-w-7xl px-5">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] sm:text-[42px] font-black tracking-[-1px] text-[#02132D]">
            Sitemap - Canada - Browse Homes & Condos for Sale and Rent
          </h1>

          <div className="hidden md:flex items-center gap-2 text-[#F58233] text-sm">
            <Home size={14} />
            Sitemap
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-6 rounded-[18px] border border-[#D8D8D8] bg-white px-6 py-5 shadow-[0_5px_12px_rgba(0,0,0,0.12)]">
          <p className="text-[14px] leading-6 text-[#4B5563]">
            Fastest way to browse Canadian Real Estate. Find Homes for Sale,
            Rent, and Investment Opportunities Across Canada.
          </p>
        </div>

        {/* PROVINCES */}
        <section className="mt-16">
          <h2 className="text-[34px] font-black text-[#02132D]">
            Regions & Directories
          </h2>

          <div className="mt-8 flex flex-wrap gap-5">
            {provinces.map((province) => (
              <Link key={province.name} href={province.href} className="group">
                <div className="flex h-[120px] min-w-[240px] flex-col items-center justify-center rounded-2xl bg-[#02132D] px-8 text-center shadow-lg transition hover:-translate-y-1">
                  <h3 className="text-[36px] font-black text-white">
                    {province.listings}
                  </h3>

                  <p className="mt-1 text-[16px] font-semibold text-[#F58233]">
                    {province.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CITIES */}
        <section className="mt-20">
          <h2 className="text-[34px] font-black text-[#02132D]">
            Most Active Real Estate Cities in Canada
          </h2>

          <div className="mt-8 space-y-5">
            {visibleCities.map((city) => (
              <Link
                key={city.name}
                href={`/real-estate-listings?loc_type=MUNC&search_text=${encodeURIComponent(city.slug)}`}
                className="block"
              >
                <div className="rounded-[22px] border border-[#D8D8D8] bg-white px-6 py-4 shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition hover:border-[#F58233] hover:shadow-xl">
                  <div className="flex items-center gap-5">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="h-[70px] w-[110px] rounded-xl object-cover bg-slate-100"
                    />

                    <div>
                      <h3 className="text-[28px] font-black text-[#02132D]">
                        {city.name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-gray-500">
                        {city.listings.toLocaleString()} Listings
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAllCities((prev) => !prev)}
            className="mt-8 text-[#F58233] font-semibold hover:underline"
          >
            {showAllCities ? "Show fewer cities ↑" : "View all cities →"}
          </button>
        </section>

        {/* ADDITIONAL SITEMAPS */}
        <section className="mt-20 pb-10">
          <h2 className="text-[34px] font-black text-[#02132D]">
            Additional Sitemaps
          </h2>

          <div className="mt-6 space-y-3">
            <Link
              href="/pre-construction-projects-by-area"
              className="block text-[#F58233] hover:underline font-medium"
            >
              • Pre-Construction Projects Sitemap
            </Link>

            <Link
              href="/home-and-condos-for-investment"
              className="block text-[#F58233] hover:underline font-medium"
            >
              • Investment Properties Sitemap
            </Link>

            <Link
              href="/top-condo-buildings-in-ontario"
              className="block text-[#F58233] hover:underline font-medium"
            >
              • Popular Condo Buildings Sitemap
            </Link>

            <Link
              href="/real-estate-by-location"
              className="block text-[#F58233] hover:underline font-medium"
            >
              • Communities & Location Browser
            </Link>

            <Link
              href="/real-estate-market-stats"
              className="block text-[#F58233] hover:underline font-medium"
            >
              • Ontario Real Estate Market Statistics
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
