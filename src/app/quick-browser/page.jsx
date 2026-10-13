"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Home,
  Building2,
  FileText,
  BarChart3,
} from "lucide-react";

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const communitiesData = [
  {
    city: "Toronto",
    muncSlug: "toronto",
    statsSlug: "toronto",
    image: "/communities/toronto.jpg",
    communitiesCount: 110,
    avgPrice: "$1.12M",
    change: "+4.6%",
    communities: [
      "Waterfront Communities C1",
      "Church-Yonge Corridor",
      "Bay Street Corridor",
      "Willowdale East",
      "Mimico",
      "Mount Pleasant West",
      "Annex",
      "High Park North",
    ],
  },
  {
    city: "Vaughan",
    muncSlug: "vaughan",
    statsSlug: "york",
    image: "/communities/vaughan.jpg",
    communitiesCount: 23,
    avgPrice: "$1.38M",
    change: "+3.8%",
    communities: [
      "Maple",
      "Woodbridge",
      "Concord",
      "Patterson",
      "Vellore Village",
      "Kleinburg",
    ],
  },
  {
    city: "Brantford",
    muncSlug: "brantford",
    statsSlug: "brant",
    image: "/communities/brantford.jpg",
    communitiesCount: 12,
    avgPrice: "$689K",
    change: "+2.3%",
    communities: ["Brantford", "Echo Place", "West Brant", "Holmedale"],
  },
  {
    city: "Muskoka",
    muncSlug: "bracebridge",
    statsSlug: "muskoka",
    image: "/communities/muskoka.jpg",
    communitiesCount: 8,
    avgPrice: "$1.45M",
    change: "+6.1%",
    communities: ["Bracebridge", "Huntsville", "Gravenhurst", "Muskoka Lakes"],
  },
];

export default function CommunitiesPage() {
  const [openCity, setOpenCity] = useState("Toronto");

  return (
    <main className="bg-[#F5F5F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-5 mt-20">
        <section className="w-full py-12">
          <div className="mx-auto max-w-7xl px-6">
            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-[-1px] text-[#0F172A]">
              Browse Real Estate by Location
            </h1>

            {/* Description Card */}
            <div className="mt-6 rounded-[18px] border border-[#D9D9D9] bg-white px-7 py-6 shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
              <p className="max-w-6xl text-base leading-[24px] text-[#374151]">
                Explore real estate listings by location to find your ideal
                home, condo, or rental property. Our platform provides detailed
                insights into property prices and market trends, making it easy
                to browse and compare options. Whether buying, renting, or
                investing, access up-to-date statistics to make informed
                decisions.
              </p>
            </div>
          </div>
        </section>

        {communitiesData.map((city) => (
          <CommunityAccordion
            key={city.city}
            city={city}
            isOpen={openCity === city.city}
            onToggle={() =>
              setOpenCity(openCity === city.city ? null : city.city)
            }
          />
        ))}
      </div>
    </main>
  );
}

function CommunityAccordion({ city, isOpen, onToggle }) {
  return (
    <div className="mb-6 max-w-6xl mx-auto overflow-hidden rounded-[28px] border border-[#D9D9D9] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
      {/* HEADER */}
      <button type="button" onClick={onToggle} className="w-full p-2 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img
              src={city.image}
              alt={city.city}
              className="h-20 w-28 rounded-2xl object-cover"
            />

            <div className="text-left">
              <h2 className="text-3xl font-black text-[#02132D]">
                {city.city}
              </h2>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {city.communitiesCount} Communities
              </p>
            </div>
          </div>

          <div className="pr-2">
            {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </div>
      </button>

      {/* DETAILS */}
      {isOpen && (
        <div className="px-7 pb-7">
          <div className="border-t border-neutral-200 pt-7">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Average Price
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <h3 className="text-4xl font-black text-[#02132D]">
                    {city.avgPrice}
                  </h3>

                  <span className="font-bold text-green-600">
                    {city.change}
                  </span>
                </div>
              </div>

              <Link
                href={`/real-estate-market-stats/${city.statsSlug}`}
                className="rounded-full border border-[#F58233] px-5 py-2 text-xs font-bold text-[#F58233] hover:bg-[#F58233] hover:text-white transition"
              >
                View {city.city} Market Stats →
              </Link>
            </div>

            <div className="my-8 border-b border-neutral-200" />

            <div className="grid gap-5">
              {city.communities.map((community) => (
                <CommunityRow
                  key={community}
                  name={community}
                  muncSlug={city.muncSlug}
                  statsSlug={city.statsSlug}
                />
              ))}
            </div>

            <Link
              href={`/real-estate-listings?loc_type=MUNC&search_text=${encodeURIComponent(city.muncSlug)}`}
              className="mt-8 inline-flex items-center gap-2 text-[#02132D] font-semibold hover:text-[#F58233]"
            >
              View all {city.city} listings ({city.communitiesCount} communities) →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function CommunityRow({ name, muncSlug, statsSlug }) {
  const commSlug = slugify(name);

  return (
    <div className="grid items-center gap-4 md:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4F4F4]">
          <MapPin size={18} className="text-[#F58233]" />
        </div>

        <Link
          href={`/real-estate-listings?loc_type=COMM&search_text=${encodeURIComponent(commSlug)}`}
          className="font-semibold text-[#02132D] hover:text-[#F58233] transition"
        >
          {name}
        </Link>
      </div>

      <QuickButton
        href={`/real-estate-listings?loc_type=COMM&search_text=${encodeURIComponent(commSlug)}&s_r=Sale&sub_type=RES`}
        icon={<Home size={14} />}
        label="Homes"
      />

      <QuickButton
        href={`/real-estate-listings?loc_type=COMM&search_text=${encodeURIComponent(commSlug)}&s_r=Sale&sub_type=CND`}
        icon={<Building2 size={14} />}
        label="Condos"
      />

      <QuickButton
        href={`/real-estate-listings?loc_type=COMM&search_text=${encodeURIComponent(commSlug)}&s_r=Lease`}
        icon={<FileText size={14} />}
        label="Leases"
      />

      <QuickButton
        href={`/real-estate-market-stats/${statsSlug || muncSlug}`}
        icon={<BarChart3 size={14} />}
        label="Stats"
      />
    </div>
  );
}

function QuickButton({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="h-10 rounded-xl border border-neutral-300 bg-white px-4 text-sm font-medium text-[#02132D] transition hover:border-[#F58233] hover:text-[#F58233] flex items-center justify-center gap-2"
    >
      {icon}
      {label}
    </Link>
  );
}
