"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";

const cities = [
  {
    id: 1,
    name: "Toronto",
    image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1200&auto=format&fit=crop",
    address: "Greater Toronto Area · Ontario",
  },
  {
    id: 2,
    name: "York",
    image: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=1200&auto=format&fit=crop",
    address: "Vaughan, Markham, Richmond Hill",
  },
  {
    id: 3,
    name: "Peel",
    image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?q=80&w=1200&auto=format&fit=crop",
    address: "Mississauga & Brampton",
  },
  {
    id: 4,
    name: "Simcoe",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    address: "Barrie & surrounding markets",
  },
  {
    id: 5,
    name: "Halton",
    image: "https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=1200&auto=format&fit=crop",
    address: "Oakville, Burlington, Milton",
  },
  {
    id: 6,
    name: "Durham",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop",
    address: "Oshawa, Whitby, Ajax",
  },
  {
    id: 7,
    name: "Niagara",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1200&auto=format&fit=crop",
    address: "St. Catharines to Niagara Falls",
  },
  {
    id: 8,
    name: "Hamilton",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop",
    address: "City & surrounding markets",
  },
  {
    id: 9,
    name: "Waterloo",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    address: "Kitchener–Waterloo corridor",
  },
];

export default function StatsPage() {
  return (
    <main className="min-h-screen bg-[#f6f6f6] py-8 pt-24 lg:pt-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8">
          <h1 className="mb-4 text-2xl font-semibold text-[#111827] sm:text-3xl lg:text-4xl">
            Real Estate Trends & Stats
          </h1>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm leading-6 text-gray-600">
              Elevate your market strategy with Listo&apos;s in-depth stats.
              Explore sold insights, new listing trends, and price changes with
              ease. Gain valuable insights at the property type level and
              compare areas effortlessly. Stay ahead of market shifts and make
              informed decisions with Listo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </div>
    </main>
  );
}

function CityCard({ city }) {
  return (
    <Link href={`/real-estate-market-stats/${city.name.toLowerCase()}`}>
      <div className="group cursor-pointer overflow-hidden rounded-2xl bg-[#040F23]">
        <div className="relative h-[190px] overflow-hidden">
          <img
            src={city.image}
            alt={city.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-white">{city.name}</h3>

          <div className="flex items-start gap-2">
            <MapPin size={14} className="mt-[2px] flex-shrink-0 text-white" />
            <p className="text-xs leading-5 text-gray-300">{city.address}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
