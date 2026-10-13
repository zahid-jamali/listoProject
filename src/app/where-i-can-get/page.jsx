"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  Search,
  Share2,
  SearchX,
} from "lucide-react";
import toast from "react-hot-toast";
import { getListingUrl, stashListing } from "@/lib/listing-url";
import Bookmark from "@/components/Bookmark";

const CITY_OPTIONS = [
  { value: "", label: "All Ontario Cities" },
  { value: "toronto", label: "Toronto, ON" },
  { value: "mississauga", label: "Mississauga, ON" },
  { value: "brampton", label: "Brampton, ON" },
  { value: "vaughan", label: "Vaughan, ON" },
  { value: "markham", label: "Markham, ON" },
  { value: "richmond-hill", label: "Richmond Hill, ON" },
  { value: "oakville", label: "Oakville, ON" },
  { value: "burlington", label: "Burlington, ON" },
  { value: "hamilton", label: "Hamilton, ON" },
  { value: "ajax", label: "Ajax, ON" },
  { value: "pickering", label: "Pickering, ON" },
  { value: "whitby", label: "Whitby, ON" },
  { value: "oshawa", label: "Oshawa, ON" },
  { value: "milton", label: "Milton, ON" },
];

const PRICE_OPTIONS = [
  { value: "500000", label: "Up to $500K" },
  { value: "650000", label: "Up to $650K" },
  { value: "750000", label: "Up to $750K" },
  { value: "850000", label: "Up to $850K" },
  { value: "900000", label: "Up to $900K" },
  { value: "1000000", label: "Up to $1.0M" },
  { value: "1250000", label: "Up to $1.25M" },
  { value: "1500000", label: "Up to $1.5M" },
  { value: "2000000", label: "Up to $2.0M" },
  { value: "2500000", label: "Up to $2.5M" },
];

const BED_OPTIONS = [
  { value: "1", label: "1+ Beds" },
  { value: "2", label: "2+ Beds" },
  { value: "3", label: "3+ Beds" },
  { value: "4", label: "4+ Beds" },
  { value: "5", label: "5+ Beds" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All Property Styles" },
  { value: "RES", label: "Houses & Townhomes" },
  { value: "CND", label: "Condos & Apartments" },
];

function formatPrice(listing) {
  if (listing?.lp_dol_text) return listing.lp_dol_text;
  const num = Number(listing?.lp_dol);
  if (Number.isFinite(num) && num > 0) {
    return `$${num.toLocaleString()}`;
  }
  return "Contact for Price";
}

function WhereICanGetContent() {
  const router = useRouter();
  const sp = useSearchParams();

  const [munc, setMunc] = useState(sp.get("munc") || "");
  const [prMax, setPrMax] = useState(sp.get("pr_max") || "900000");
  const [brMin, setBrMin] = useState(sp.get("br_min") || "3");
  const [subType, setSubType] = useState(sp.get("sub_type") || "");

  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(18);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const q = new URLSearchParams({
        type: "RS",
        s_r: "Sale",
        limit: String(limit),
        incl_total: "1",
        sort: "ld",
        order: "desc",
      });

      if (munc) {
        q.set("loc_type", "MUNC");
        q.set("search_text", munc);
      }
      if (prMax) q.set("pr_max", prMax);
      if (brMin) q.set("br_min", brMin);
      if (subType) q.set("sub_type", subType);

      const res = await fetch(`/api/listings?${q.toString()}`);
      const data = await res.json();
      setListings(data?.rows || []);
      setTotal(Number(data?.total || data?.count || 0));
    } catch (err) {
      console.error("Failed to load where-can-i-buy listings:", err);
      setListings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [munc, prMax, brMin, subType, limit]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleClearAll = () => {
    setMunc("");
    setPrMax("1000000");
    setBrMin("2");
    setSubType("");
    setLimit(18);
  };

  const handleDetails = (listing) => {
    stashListing(listing);
    router.push(getListingUrl(listing));
  };

  const handleShare = async (listing) => {
    const url = `${window.location.origin}${getListingUrl(listing)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.addr || "LISTO Property",
          url,
        });
        return;
      } catch {
        // fallback
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Listing link copied!");
    } catch {
      toast.error("Could not copy link");
    }
  };

  // Compute city distribution pills from returned rows so users can see where homes are available
  const cityCounts = listings.reduce((acc, item) => {
    const city = item.municipality || item.area;
    if (city) acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="bg-[#f5f5f5] min-h-screen py-10 mt-20">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-[28px] font-bold text-[#111]">
            Where Can I Buy {brMin}+ Bedrooms Under $
            {Number(prMax).toLocaleString()}?
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
            <div className="flex gap-2.5 flex-wrap text-xs">
              <div className="border rounded-full px-3.5 py-1.5 bg-white font-medium">
                Price Range: Up to ${Number(prMax).toLocaleString()}
              </div>

              <div className="border rounded-full px-3.5 py-1.5 bg-white font-medium">
                Bedrooms: {brMin}+
              </div>

              <div className="border border-orange-200 rounded-full px-3.5 py-1.5 bg-orange-50 text-[#F97316] font-semibold">
                {loading
                  ? "Searching…"
                  : `${total.toLocaleString()} properties available`}
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearAll}
              className="text-[#F97316] hover:underline text-xs font-semibold"
            >
              × Clear All
            </button>
          </div>
        </div>

        {/* City Quick Pills */}
        {Object.keys(cityCounts).length > 0 && (
          <div className="mb-5 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 mr-1">
              Top Matching Cities:
            </span>
            <button
              type="button"
              onClick={() => setMunc("")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                !munc
                  ? "bg-[#071B3A] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-[#F97316]"
              }`}
            >
              All Cities
            </button>
            {Object.entries(cityCounts)
              .slice(0, 8)
              .map(([city, cnt]) => {
                const slug = city.toLowerCase().replace(/\s+/g, "-");
                const active = munc === slug;
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setMunc(active ? "" : slug)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "bg-[#F97316] text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-[#F97316]"
                    }`}
                  >
                    {city} ({cnt})
                  </button>
                );
              })}
          </div>
        )}

        {/* Search Toolbar */}
        <div className="bg-white rounded-xl border border-[#ddd] shadow-sm p-3 mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <select
              value={munc}
              onChange={(e) => {
                setMunc(e.target.value);
                setLimit(18);
              }}
              className="h-11 px-3 border rounded-lg text-sm outline-none focus:border-[#F97316]"
            >
              {CITY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={prMax}
              onChange={(e) => {
                setPrMax(e.target.value);
                setLimit(18);
              }}
              className="h-11 px-3 border rounded-lg text-sm outline-none focus:border-[#F97316]"
            >
              {PRICE_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
              {!PRICE_OPTIONS.some((p) => p.value === String(prMax)) && (
                <option value={prMax}>
                  Up to ${Number(prMax).toLocaleString()}
                </option>
              )}
            </select>

            <select
              value={brMin}
              onChange={(e) => {
                setBrMin(e.target.value);
                setLimit(18);
              }}
              className="h-11 px-3 border rounded-lg text-sm outline-none focus:border-[#F97316]"
            >
              {BED_OPTIONS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>

            <select
              value={subType}
              onChange={(e) => {
                setSubType(e.target.value);
                setLimit(18);
              }}
              className="h-11 px-3 border rounded-lg text-sm outline-none focus:border-[#F97316]"
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={fetchProperties}
              className="bg-[#071B3A] hover:bg-[#0B2450] transition text-white rounded-lg h-11 flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Search size={15} />
              Update Search
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading && listings.length === 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[340px] rounded-xl bg-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <SearchX size={44} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-800">
              No properties found for these filters
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Try increasing your budget range or selecting fewer bedrooms to see more locations.
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              className="mt-5 rounded-full bg-[#F97316] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#ea6a10]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {listings.map((property, i) => {
                const imgSrc =
                  property.thumbnail ||
                  property.photos?.[0]?.src ||
                  property.photos?.[0] ||
                  "/assets/buy.png";
                return (
                  <div
                    key={`${property.id || i}-${property.brd || ""}`}
                    onClick={() => handleDetails(property)}
                    className="bg-[#071B3A] rounded-xl overflow-hidden shadow-md cursor-pointer transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="relative h-[195px] bg-slate-800">
                      <img
                        src={imgSrc}
                        alt={property.addr || "Property"}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                        <span className="bg-white text-[#071B3A] text-[10px] px-2.5 py-1 rounded-full font-semibold">
                          {property.municipality || "MLS®"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 text-white">
                      <h2 className="text-[24px] font-bold mb-2">
                        {formatPrice(property)}
                      </h2>

                      <div className="flex items-start gap-2 text-[12px] text-gray-300 mb-3 min-h-[34px]">
                        <MapPin
                          size={13}
                          className="mt-0.5 shrink-0 text-[#F97316]"
                        />
                        <span>
                          <span className="font-medium text-white line-clamp-1">
                            {property.addr}
                          </span>
                          <span className="text-gray-300">
                            {[property.community, property.municipality]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </span>
                      </div>

                      <div className="flex gap-2 flex-wrap mb-4">
                        {property.br != null && (
                          <div className="bg-white text-black text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <BedDouble size={11} />
                            {property.br}
                            {property.br_plus ? `+${property.br_plus}` : ""} Beds
                          </div>
                        )}

                        {property.bath_tot != null && (
                          <div className="bg-white text-black text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Bath size={11} />
                            {property.bath_tot} Baths
                          </div>
                        )}

                        {property.sqft && (
                          <div className="bg-white text-black text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Square size={11} />
                            {property.sqft} sqft
                          </div>
                        )}
                      </div>

                      <div
                        className="flex items-center justify-between pt-2 border-t border-white/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleDetails(property)}
                          className="bg-[#F97316] hover:bg-[#ea6a10] transition text-white text-xs font-semibold px-5 py-2 rounded-md"
                        >
                          Details →
                        </button>

                        <div className="flex items-center gap-2">
                          <Bookmark
                            listing={property}
                            className="!h-8 !w-8 !rounded-lg !border-white/20 !text-white hover:!border-[#F97316] hover:!text-[#F97316]"
                          />
                          <button
                            type="button"
                            onClick={() => handleShare(property)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 text-white hover:border-[#F97316] hover:text-[#F97316] transition"
                            title="Share property"
                          >
                            <Share2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {listings.length < total && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setLimit((prev) => prev + 18)}
                  className="rounded-full bg-[#F97316] hover:bg-[#ea6a10] px-8 py-3 text-sm font-bold text-white shadow-md disabled:opacity-50 transition"
                >
                  {loading ? "Loading…" : "Load More Properties"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function PropertyResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f5f5] py-10 mt-20 max-w-7xl mx-auto px-5">
          <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-xl" />
        </div>
      }
    >
      <WhereICanGetContent />
    </Suspense>
  );
}
