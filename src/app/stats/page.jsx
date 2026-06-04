import Image from "next/image";
import { MapPin } from "lucide-react";
import Link from "next/link";

const cities = [
  {
    id: 1,
    name: "Toronto",
    image: "https://images.unsplash.com/photo-1517935706615-2717063c2225",
    address: "31 1/2 Geriside Avenue N, Homeside, Hamilton",
  },
  {
    id: 2,
    name: "York",
    image: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2",
    address: "31 1/2 Geriside Avenue N, Homeside, Hamilton",
  },
  {
    id: 3,
    name: "Peel",
    image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb",
    address: "31 1/2 Geriside Avenue N, Homeside, Hamilton",
  },
  {
    id: 4,
    name: "Simcoe",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    address: "31 1/2 Geriside Avenue N, Homeside, Hamilton",
  },
  {
    id: 5,
    name: "Halton",
    image: "https://images.unsplash.com/photo-1465447142348-e9952c393450",
    address: "31 1/2 Geriside Avenue N, Homeside, Hamilton",
  },
  {
    id: 6,
    name: "Durham",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    address: "31 1/2 Geriside Avenue N, Homeside, Hamilton",
  },
  {
    id: 7,
    name: "Niagara",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
    address: "31 1/2 Geriside Avenue N, Homeside, Hamilton",
  },
  {
    id: 8,
    name: "Hamilton",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    address: "31 1/2 Geriside Avenue N, Homeside, Hamilton",
  },
  {
    id: 9,
    name: "Waterloo",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    address: "31 1/2 Geriside Avenue N, Homeside, Hamilton",
  },
];

export default function StatsPage() {
  return (
    <main className="bg-[#f6f6f6] min-h-screen py-8 mt-20 ">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#111827] mb-4">
            Real Estate Trends & Stats
          </h1>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-600 leading-6">
              Elevate your market strategy with Listo's in-depth stats. Explore
              sold insights, new listing trends, and price changes with ease.
              Gain valuable insights at the property type level and compare
              areas effortlessly. Stay ahead of market shifts and make informed
              decisions with Listo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
    <Link href={`/stats/${city.name.toLowerCase()}`}>
      <div className="overflow-hidden rounded-2xl bg-[#071529] group cursor-pointer">
        <div className="relative h-[190px] overflow-hidden">
          <img
            src={city.image}
            alt={city.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 className="text-white text-lg font-semibold mb-2">{city.name}</h3>

          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-white mt-[2px] flex-shrink-0" />

            <p className="text-xs text-gray-300 leading-5">{city.address}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
