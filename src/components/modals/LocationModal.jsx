"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Crosshair,
  X,
  Building2,
  ChevronRight,
  Check,
  Loader2,
  Compass,
} from "lucide-react";
import { useLocation, DEFAULT_LOCATION } from "@/context/LocationContext";
import { toast } from "react-hot-toast";

// Curated top popular cities for quick selection
const TOP_POPULAR_CITIES = [
  { name: "Toronto", munc_slug: "toronto", count: 1237 },
  { name: "Mississauga", munc_slug: "mississauga", count: 234 },
  { name: "Brampton", munc_slug: "brampton", count: 420 },
  { name: "Hamilton", munc_slug: "hamilton", count: 483 },
  { name: "Vaughan", munc_slug: "vaughan", count: 145 },
  { name: "Markham", munc_slug: "markham", count: 162 },
  { name: "Oakville", munc_slug: "oakville", count: 118 },
  { name: "Barrie", munc_slug: "barrie", count: 177 },
  { name: "London", munc_slug: "london-east", count: 201 },
  { name: "Niagara Falls", munc_slug: "niagara-falls", count: 180 },
  { name: "Calgary", munc_slug: "calgary", count: 95 },
  { name: "Dubai", munc_slug: "dubai", count: 68 },
];

export default function LocationModal() {
  const {
    selectedLocation,
    setLocation,
    isLocationModalOpen,
    setIsLocationModalOpen,
    marketsList,
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter 400+ picklist markets based on search query
  const filteredMarkets = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return marketsList
      .filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.munc_slug.toLowerCase().includes(query)
      )
      .slice(0, 15);
  }, [searchQuery, marketsList]);

  // GPS auto-detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            const address = data.address || {};
            const detectedCity =
              address.city ||
              address.town ||
              address.municipality ||
              address.county ||
              address.state_district ||
              "";

            const normalizedCity = detectedCity.toLowerCase().replace(/\s+/g, "-");

            const match = marketsList.find(
              (m) =>
                m.munc_slug === normalizedCity ||
                m.name.toLowerCase() === detectedCity.toLowerCase() ||
                normalizedCity.includes(m.munc_slug)
            );

            if (match) {
              setLocation({
                ...match,
                lat: latitude,
                lon: longitude,
              });
              toast.success(`Location set to ${match.name}`);
              return;
            } else if (detectedCity) {
              setLocation({
                name: detectedCity,
                munc_slug: normalizedCity,
                loc_type: "MUNC",
                lat: latitude,
                lon: longitude,
              });
              toast.success(`Location set to ${detectedCity}`);
              return;
            }
          }
          setLocation(DEFAULT_LOCATION);
          toast.success("Location set to Toronto (GTA)");
        } catch (err) {
          console.error("Geocoding lookup error:", err);
          setLocation(DEFAULT_LOCATION);
          toast.success("Location set to Toronto (GTA)");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn("Geolocation permission denied or error:", error);
        setIsLocating(false);
        setLocation(DEFAULT_LOCATION);
        toast.success("Showing listings in Toronto");
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const handleSelectCity = (city) => {
    setLocation({
      name: city.name,
      munc_slug: city.munc_slug,
      loc_type: "MUNC",
      count: city.count,
    });
    toast.success(`Showing listings in ${city.name}`);
  };

  const handleClose = () => {
    if (!selectedLocation) {
      setLocation(DEFAULT_LOCATION);
    }
    setIsLocationModalOpen(false);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all"
          />

          {/* Modal Card with Dynamic Viewport Height on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: "100%", sm: { opacity: 0, scale: 0.96, y: 16 } }}
            animate={{ opacity: 1, y: 0, sm: { opacity: 1, scale: 1, y: 0 } }}
            exit={{ opacity: 0, y: "100%", sm: { opacity: 0, scale: 0.96, y: 16 } }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-2xl max-h-[88dvh] sm:max-h-[85vh] flex flex-col overflow-hidden rounded-t-[28px] sm:rounded-3xl border border-gray-200 bg-white text-slate-900 shadow-2xl"
          >
            {/* Mobile Sheet Handle Bar */}
            <div className="pt-2.5 pb-0.5 flex justify-center sm:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5 sm:px-8 sm:py-5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-orange-50 text-[#F58232] border border-orange-100 shrink-0">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold tracking-tight text-slate-900">
                    Choose Your Location
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
                    Select a city to explore localized properties
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 hover:text-slate-800 shrink-0 ml-2"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body - Flexible and Smooth Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-8 sm:py-6 space-y-4 sm:space-y-6">
              {/* GPS Auto-Detect Option */}
              <div className="flex items-center justify-between gap-2.5 rounded-2xl border border-orange-200 bg-orange-50/60 p-3 sm:p-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-orange-200 text-[#F58232] shadow-sm">
                    <Crosshair size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      Use Current Location
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                      Detect your city via GPS
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-[#F58232] hover:bg-[#e67428] px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition-all active:scale-95 disabled:opacity-60"
                >
                  {isLocating ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Crosshair size={13} />
                      Detect City
                    </>
                  )}
                </button>
              </div>

              {/* Search Bar */}
              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Search size={12} className="text-[#F58232]" />
                  Search Market or City
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type city (e.g. Toronto, Mississauga, Brampton)..."
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-9 text-xs sm:text-sm text-slate-900 placeholder:text-gray-400 transition-all focus:border-[#F58232] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-700"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filtered Search Results */}
                {searchQuery.trim().length > 0 && (
                  <div className="mt-1.5 max-h-48 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-lg space-y-1">
                    {filteredMarkets.length > 0 ? (
                      filteredMarkets.map((market) => (
                        <button
                          key={market.munc_slug}
                          onClick={() => handleSelectCity(market)}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs sm:text-sm text-slate-800 transition-colors hover:bg-orange-50 hover:text-[#F58232]"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-[#F58232]" />
                            <span className="font-semibold">{market.name}</span>
                          </div>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-slate-600 font-medium">
                            {market.count > 0 ? `${market.count.toLocaleString()} Listings` : "Active"}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="py-3 text-center text-xs text-slate-500">
                        No market found for "{searchQuery}". Pick a city below.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Popular Cities Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-600">
                    Popular Markets
                  </label>
                  <span className="text-[10px] sm:text-[11px] text-slate-400">
                    Ontario & Top Regions
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {TOP_POPULAR_CITIES.map((city) => {
                    const isSelected =
                      selectedLocation?.munc_slug === city.munc_slug;
                    return (
                      <button
                        key={city.munc_slug}
                        onClick={() => handleSelectCity(city)}
                        className={`group relative flex items-center justify-between rounded-2xl border p-2.5 sm:p-3 text-left transition-all duration-150 ${
                          isSelected
                            ? "border-[#F58232] bg-orange-50/80 text-slate-900 shadow-sm"
                            : "border-gray-200 bg-gray-50/60 text-slate-800 hover:border-orange-200 hover:bg-orange-50/30"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                              isSelected
                                ? "bg-[#F58232] text-white border-[#F58232]"
                                : "bg-white text-gray-500 border-gray-200 group-hover:text-[#F58232] group-hover:border-orange-200"
                            }`}
                          >
                            <Building2 size={13} />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`truncate text-xs sm:text-sm font-bold ${
                                isSelected ? "text-[#F58232]" : "text-slate-900"
                              }`}
                            >
                              {city.name}
                            </p>
                            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                              {city.count > 0
                                ? `${city.count.toLocaleString()} listings`
                                : "Active"}
                            </p>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full bg-[#F58232] text-white">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        ) : (
                          <ChevronRight
                            size={13}
                            className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3 sm:px-8 sm:py-4 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate min-w-0">
                <MapPin size={13} className="text-[#F58232] shrink-0" />
                <span className="truncate">
                  Current:{" "}
                  <strong className="text-slate-900">
                    {selectedLocation?.name || "All Ontario"}
                  </strong>
                </span>
              </div>

              <button
                onClick={handleClose}
                className="shrink-0 rounded-xl border border-gray-300 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-gray-100"
              >
                All Regions
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
