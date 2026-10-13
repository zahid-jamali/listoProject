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
  { value: "", label: "All Ontario" },
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
  { value: "500000", label: "Up to $500,000" },
  { value: "650000", label: "Up to $650,000" },
  { value: "750000", label: "Up to $750,000" },
  { value: "850000", label: "Up to $850,000" },
  { value: "900000", label: "Up to $900,000" },
  { value: "1000000", label: "Up to $1,000,000" },
  { value: "1250000", label: "Up to $1,250,000" },
  { value: "1500000", label: "Up to $1,500,000" },
  { value: "2000000", label: "Up to $2,000,000" },
  { value: "2500000", label: "Up to $2,500,000" },
];

const BED_OPTIONS = [
  { value: "1", label: "1+ Beds" },
  { value: "2", label: "2+ Beds" },
  { value: "3", label: "3+ Beds" },
  { value: "4", label: "4+ Beds" },
  { value: "5", label: "5+ Beds" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All Property Types" },
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

function WhatICanGetContent() {
  const router = useRouter();
  const sp = useSearchParams();

  const [munc, setMunc] = useState(sp.get("munc") || "toronto");
  const [prMax, setPrMax] = useState(sp.get("pr_max") || "900000");
  const [brMin, setBrMin] = useState(sp.get("br_min") || "2");
  const [subType, setSubType] = useState(sp.get("sub_type") || "");

  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(18);

  const fetchProperties = useCallback(
    async (overrides = {}) => {
      const targetMunc = overrides.munc !== undefined ? overrides.munc : munc;
      const targetPrMax = overrides.prMax !== undefined ? overrides.prMax : prMax;
      const targetBrMin = overrides.brMin !== undefined ? overrides.brMin : brMin;
      const targetSubType =
        overrides.subType !== undefined ? overrides.subType : subType;
      const targetLimit = overrides.limit !== undefined ? overrides.limit : limit;

      try {
        setLoading(true);
        const q = new URLSearchParams({
          type: "RS",
          s_r: "Sale",
          limit: String(targetLimit),
          incl_total: "1",
          sort: "ld",
          order: "desc",
        });

        if (targetMunc) {
          q.set("loc_type", "MUNC");
          q.set("search_text", targetMunc);
        }
        if (targetPrMax) q.set("pr_max", targetPrMax);
        if (targetBrMin) q.set("br_min", targetBrMin);
        if (targetSubType) q.set("sub_type", targetSubType);

        const res = await fetch(`/api/listings?${q.toString()}`);
        const data = await res.json();
        setListings(data?.rows || []);
        setTotal(Number(data?.total || data?.count || 0));
      } catch (err) {
        console.error("Failed to load affordability listings:", err);
        setListings([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [munc, prMax, brMin, subType, limit],
  );

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleClearAll = () => {
    setMunc("");
    setPrMax("1000000");
    setBrMin("1");
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
        // fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Listing link copied!");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const cityLabel =
    CITY_OPTIONS.find((c) => c.value === munc)?.label || "All Ontario";

  return (
    <main className="min-h-screen bg-[#f5f5f5] py-10 mt-20">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[30px] font-bold text-[#111827] mb-3">
            What Can I Get in {cityLabel}?
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              <span className="bg-[#ECECEC] text-[#444] text-xs font-medium px-3 py-1.5 rounded-full">
                Location: {cityLabel}
              </span>
              <span className="bg-[#ECECEC] text-[#444] text-xs font-medium px-3 py-1.5 rounded-full">
                Price Range: Up to ${Number(prMax).toLocaleString()}
              </span>
              <span className="bg-[#ECECEC] text-[#444] text-xs font-medium px-3 py-1.5 rounded-full">
                Bedrooms: {brMin}+
              </span>
              <span className="bg-orange-50 text-[#F97316] border border-orange-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                {loading
                  ? "Searching…"
                  : `${total.toLocaleString()} matching properties`}
              </span>
            </div>

            <button
              type="button"
              onClick={handleClearAll}
              className="text-[#F97316] hover:underline text-xs font-semibold"
            >
              × Clear all filters
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#d9d9d9] rounded-xl shadow-md p-3 mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 px-1">
                Location
              </label>
              <select
                value={munc}
                onChange={(e) => {
                  setMunc(e.target.value);
                  setLimit(18);
                }}
                className="w-full h-[42px] border border-[#e5e5e5] rounded-lg px-3 text-[13px] font-medium text-[#111] outline-none focus:border-[#F97316]"
              >
                {CITY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 px-1">
                Max Budget
              </label>
              <select
                value={prMax}
                onChange={(e) => {
                  setPrMax(e.target.value);
                  setLimit(18);
                }}
                className="w-full h-[42px] border border-[#e5e5e5] rounded-lg px-3 text-[13px] font-medium text-[#111] outline-none focus:border-[#F97316]"
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
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 px-1">
                Bedrooms
              </label>
              <select
                value={brMin}
                onChange={(e) => {
                  setBrMin(e.target.value);
                  setLimit(18);
                }}
                className="w-full h-[42px] border border-[#e5e5e5] rounded-lg px-3 text-[13px] font-medium text-[#111] outline-none focus:border-[#F97316]"
              >
                {BED_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 px-1">
                Property Type
              </label>
              <select
                value={subType}
                onChange={(e) => {
                  setSubType(e.target.value);
                  setLimit(18);
                }}
                className="w-full h-[42px] border border-[#e5e5e5] rounded-lg px-3 text-[13px] font-medium text-[#111] outline-none focus:border-[#F97316]"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => fetchProperties()}
                className="w-full h-[42px] bg-[#071B3A] hover:bg-[#0B2450] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
              >
                <Search size={14} />
                Update Search
              </button>
            </div>
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
              No properties match these exact filters
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Try increasing your maximum budget, reducing minimum bedrooms, or switching to All Ontario.
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              className="mt-5 rounded-full bg-[#F97316] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#ea6d14]"
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
                    className="bg-[#061A38] rounded-xl overflow-hidden border border-[#dcdcdc] shadow-md cursor-pointer transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="relative h-[195px] bg-slate-800">
                      <img
                        src={imgSrc}
                        alt={property.addr || "Property"}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
                        <span className="bg-white text-[#061A38] text-[10px] px-2.5 py-1 rounded-full font-semibold shadow">
                          {property.badges1?.[0]?.text ||
                            property.type_own1_out ||
                            "MLS®"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h2 className="text-white text-[26px] font-bold leading-none mb-3">
                        {formatPrice(property)}
                      </h2>

                      <div className="flex items-start gap-2 text-white/80 text-xs leading-4 mb-3 min-h-[32px]">
                        <MapPin size={13} className="mt-0.5 shrink-0 text-[#F97316]" />
                        <div>
                          <div className="font-medium text-white line-clamp-1">
                            {property.addr}
                          </div>
                          <div className="text-white/70">
                            {[property.community, property.municipality]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {property.br != null && (
                          <span className="bg-white text-[#061A38] rounded-full px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1">
                            <BedDouble size={11} />
                            {property.br}
                            {property.br_plus ? `+${property.br_plus}` : ""} Beds
                          </span>
                        )}

                        {property.bath_tot != null && (
                          <span className="bg-white text-[#061A38] rounded-full px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1">
                            <Bath size={11} />
                            {property.bath_tot} Baths
                          </span>
                        )}

                        {property.sqft && (
                          <span className="bg-white text-[#061A38] rounded-full px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1">
                            <Square size={11} />
                            {property.sqft} sqft
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div
                        className="flex items-center justify-between pt-2 border-t border-white/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleDetails(property)}
                          className="bg-[#F97316] hover:bg-[#ea6d14] text-white text-xs font-semibold px-6 py-2 rounded-lg transition"
                        >
                          Details →
                        </button>

                        <div className="flex items-center gap-2 text-white">
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
                  className="rounded-full bg-[#F97316] hover:bg-[#ea6d14] px-8 py-3 text-sm font-bold text-white shadow-md disabled:opacity-50 transition"
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

export default function WhatICanGetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f5f5] py-10 mt-20 max-w-7xl mx-auto px-5">
          <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-xl" />
        </div>
      }
    >
      <WhatICanGetContent />
    </Suspense>
  );
}
