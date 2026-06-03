"use client";

import Image from "next/image";
import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  Search,
  Heart,
  Share2,
} from "lucide-react";

const properties = [
  {
    id: 1,
    price: "$550,000",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200",
    address: "1911 Brockton Road, Mortgage, ON",
    city: "Toronto",
    beds: 4,
    baths: 2,
    sqft: 1800,
  },
  {
    id: 2,
    price: "$727,000",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200",
    address: "845 Priory Road, Mortgage, ON",
    city: "Toronto",
    beds: 3,
    baths: 2,
    sqft: 1650,
  },
  {
    id: 3,
    price: "$584,000",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
    address: "918 Redwood Road, Mortgage, ON",
    city: "Toronto",
    beds: 2,
    baths: 2,
    sqft: 1450,
  },
  {
    id: 4,
    price: "$550,000",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200",
    address: "1917 Brockton Road, Mortgage, ON",
    city: "Toronto",
    beds: 4,
    baths: 3,
    sqft: 1900,
  },
  {
    id: 5,
    price: "$727,000",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    address: "845 Priory Road, Mortgage, ON",
    city: "Toronto",
    beds: 3,
    baths: 2,
    sqft: 1650,
  },
  {
    id: 6,
    price: "$584,000",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200",
    address: "1918 Redwood Road, Mortgage, ON",
    city: "Toronto",
    beds: 2,
    baths: 2,
    sqft: 1500,
  },
  {
    id: 7,
    price: "$550,000",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200",
    address: "1811 Brockton Road, Mortgage, ON",
    city: "Toronto",
    beds: 4,
    baths: 2,
    sqft: 1700,
  },
  {
    id: 8,
    price: "$727,000",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200",
    address: "945 Priory Road, Mortgage, ON",
    city: "Toronto",
    beds: 3,
    baths: 2,
    sqft: 1800,
  },
  {
    id: 9,
    price: "$584,000",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200",
    address: "1918 Redwood Road, Mortgage, ON",
    city: "Toronto",
    beds: 2,
    baths: 2,
    sqft: 1450,
  },
];

export default function PropertyResultsPage() {
  return (
    <main className="bg-[#f5f5f5] min-h-screen py-10 mt-20">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-[22px] font-bold text-[#111]">
            Where can I get?
          </h1>

          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-3 text-[11px]">
              <div className="border rounded-md px-3 py-1 bg-white">
                Price Range: Up to $900,000
              </div>

              <div className="border rounded-md px-3 py-1 bg-white">
                Bedrooms: 2+
              </div>
            </div>

            <button className="text-[#F97316] text-xs font-medium">
              Clear All
            </button>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="bg-white rounded-xl border border-[#ddd] shadow-sm p-3 mb-6">
          <div className="grid lg:grid-cols-5 gap-3">
            <select className="h-11 px-3 border rounded-lg text-sm">
              <option>Toronto, ON</option>
            </select>

            <select className="h-11 px-3 border rounded-lg text-sm">
              <option>Up to $900K</option>
            </select>

            <select className="h-11 px-3 border rounded-lg text-sm">
              <option>2+ Beds</option>
            </select>

            <select className="h-11 px-3 border rounded-lg text-sm">
              <option>Get 58 out of 58</option>
            </select>

            <button className="bg-[#071B3A] text-white rounded-lg h-11 flex items-center justify-center gap-2 text-sm font-medium">
              <Search size={15} />
              Update Search
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-[#071B3A] rounded-xl overflow-hidden shadow-md"
            >
              {/* Image */}
              <div className="relative h-[190px]">
                <img
                  src={property.image}
                  alt={property.address}
                  fill
                  className="object-cover"
                />

                <div className="absolute top-2 left-2">
                  <span className="bg-white text-[10px] px-2 py-1 rounded-full font-medium">
                    MLS®
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 text-white">
                <h2 className="text-[24px] font-bold mb-2">{property.price}</h2>

                <div className="flex items-start gap-2 text-[12px] text-gray-300 mb-3">
                  <MapPin size={13} className="mt-0.5" />
                  <span>
                    {property.address}
                    <br />
                    {property.city}
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap mb-4">
                  <div className="bg-white text-black text-[11px] px-2 py-1 rounded-full flex items-center gap-1">
                    <BedDouble size={11} />
                    {property.beds}
                  </div>

                  <div className="bg-white text-black text-[11px] px-2 py-1 rounded-full flex items-center gap-1">
                    <Bath size={11} />
                    {property.baths}
                  </div>

                  <div className="bg-white text-black text-[11px] px-2 py-1 rounded-full flex items-center gap-1">
                    <Square size={11} />
                    {property.sqft} sqft
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button className="bg-[#F97316] hover:bg-[#ea6a10] transition text-white text-xs font-medium px-5 py-2 rounded-md">
                    Details →
                  </button>

                  <div className="flex gap-3">
                    <button>
                      <Heart size={15} />
                    </button>

                    <button>
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
