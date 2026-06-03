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
  ChevronDown,
} from "lucide-react";

const properties = [
  {
    id: 1,
    price: "$550,000",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200",
    address: "1181 Holbrook Road, Montague, ON K7A 4S7",
    city: "Montague Twp, Ontario",
    beds: 4,
    baths: 2,
    sqft: 1500,
  },
  {
    id: 2,
    price: "$727,000",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200",
    address: "845 Priory Road, Montague, ON K7A 4S7",
    city: "Montague Twp, Ontario",
    beds: 4,
    baths: 2,
    sqft: 1500,
  },
  {
    id: 3,
    price: "$584,000",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
    address: "1918 Rosedale Road N, Montague, ON",
    city: "Montague Twp, Ontario",
    beds: 4,
    baths: 2,
    sqft: 1500,
  },
  {
    id: 4,
    price: "$550,000",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200",
    address: "1181 Holbrook Road, Montague, ON K7A 4S7",
    city: "Montague Twp, Ontario",
    beds: 4,
    baths: 2,
    sqft: 1500,
  },
  {
    id: 5,
    price: "$727,000",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    address: "845 Priory Road, Montague, ON K7A 4S7",
    city: "Montague Twp, Ontario",
    beds: 4,
    baths: 2,
    sqft: 1500,
  },
  {
    id: 6,
    price: "$584,000",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200",
    address: "1918 Rosedale Road N, Montague, ON",
    city: "Montague Twp, Ontario",
    beds: 4,
    baths: 2,
    sqft: 1500,
  },
  {
    id: 7,
    price: "$550,000",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200",
    address: "1181 Holbrook Road, Montague, ON K7A 4S7",
    city: "Montague Twp, Ontario",
    beds: 4,
    baths: 2,
    sqft: 1500,
  },
  {
    id: 8,
    price: "$727,000",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1200",
    address: "845 Priory Road, Montague, ON K7A 4S7",
    city: "Montague Twp, Ontario",
    beds: 4,
    baths: 2,
    sqft: 1500,
  },
  {
    id: 9,
    price: "$584,000",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200",
    address: "1918 Rosedale Road N, Montague, ON",
    city: "Montague Twp, Ontario",
    beds: 4,
    baths: 2,
    sqft: 1500,
  },
];

export default function WhatICanGetPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] py-10 mt-20">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[30px] font-bold text-[#111827] mb-3">
            What can I get
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <span className="bg-[#ECECEC] text-[#666] text-[11px] px-3 py-1 rounded-full">
                Price Range: Up to $900,000
              </span>

              <span className="bg-[#ECECEC] text-[#666] text-[11px] px-3 py-1 rounded-full">
                Bedrooms: 2+
              </span>
            </div>

            <button className="text-[#F97316] text-xs font-medium">
              × Clear all
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#d9d9d9] rounded-xl shadow-md p-3 mb-6">
          <div className="grid lg:grid-cols-5 gap-3">
            <Filter label="Location" value="Toronto, ON" />
            <Filter label="Price" value="Up to $900k" />
            <Filter label="Bedrooms" value="2+ Beds" />
            <Filter label="Varient" value="Can get 58 out of 58" />

            <button className="h-[42px] bg-[#071B3A] hover:bg-[#0B2450] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              <Search size={14} />
              Update Search
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-[#061A38] rounded-xl overflow-hidden border border-[#dcdcdc] shadow-md"
            >
              {/* Image */}
              <div className="relative h-[185px]">
                <Image
                  src={property.image}
                  alt={property.address}
                  fill
                  className="object-cover"
                />

                <div className="absolute top-2 left-2">
                  <span className="bg-white text-[9px] px-2 py-1 rounded-full font-medium">
                    New Listing
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="text-white text-[28px] font-bold leading-none mb-3">
                  {property.price}
                </h2>

                <div className="flex items-start gap-2 text-white/80 text-[11px] leading-4 mb-3">
                  <MapPin size={12} className="mt-0.5 shrink-0" />
                  <div>
                    {property.address}
                    <br />
                    {property.city}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="bg-white rounded-full px-2 py-1 text-[10px] flex items-center gap-1">
                    <BedDouble size={10} />
                    {property.beds}
                  </span>

                  <span className="bg-white rounded-full px-2 py-1 text-[10px] flex items-center gap-1">
                    <Bath size={10} />
                    {property.baths}
                  </span>

                  <span className="bg-white rounded-full px-2 py-1 text-[10px] flex items-center gap-1">
                    <Square size={10} />
                    {property.sqft} sqft
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <button className="bg-[#F97316] hover:bg-[#ea6d14] text-white text-[11px] font-medium px-8 py-2 rounded">
                    Details
                  </button>

                  <div className="flex items-center gap-3 text-white">
                    <Heart size={14} />
                    <Share2 size={14} />
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

function Filter({ label, value }) {
  return (
    <button className="h-[42px] border border-[#e5e5e5] rounded-lg px-3 flex items-center justify-between hover:bg-gray-50 transition">
      <div className="text-left">
        <p className="text-[10px] text-[#888]">{label}</p>
        <p className="text-[13px] font-medium text-[#111]">{value}</p>
      </div>

      <ChevronDown size={14} className="text-[#777]" />
    </button>
  );
}
