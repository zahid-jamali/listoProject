"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import SearchResultsDropdown from "./SearchResultsDropdown";
import {
  getListingUrl,
  getProjectUrl,
  stashListing,
  stashProject,
} from "@/lib/listing-url";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dropdownRect, setDropdownRect] = useState(null);
  const [mounted, setMounted] = useState(false);

  const searchRef = useRef(null);
  const inputWrapRef = useRef(null);
  const dropdownRef = useRef(null);

  // Portal needs client-side only
  useEffect(() => {
    setMounted(true);
  }, []);

  // Recalculate dropdown anchor whenever shown or results change
  const updateRect = useCallback(() => {
    if (inputWrapRef.current) {
      const r = inputWrapRef.current.getBoundingClientRect();
      const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 360;
      const width = Math.min(r.width, viewportWidth - 16);
      const left = Math.max(8, Math.min(r.left + window.scrollX, viewportWidth - width - 8));
      setDropdownRect({
        top: r.bottom + window.scrollY + 6,
        left,
        width,
      });
    }
  }, []);

  useEffect(() => {
    if (showResults) updateRect();
  }, [showResults, results, updateRect]);

  // Also reposition on scroll / resize
  useEffect(() => {
    if (!showResults) return;
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
  }, [showResults, updateRect]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      const inInput = searchRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inInput && !inDropdown) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/main-search?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        setResults(data || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Search button / Enter: navigate to the best matching result (like the
  // legacy typeahead). Falls back to the listings page for free-text queries.
  const handleSubmit = () => {
    if (results.length) {
      const item = results[0];
      const category = item.category || "";
      setShowResults(false);
      setQuery("");

      if (item.type === "PC" || category === "PC") {
        stashProject(item);
        router.push(getProjectUrl(item));
      } else if (
        ["HOMES", "CONDOS", "ASSIGNMENT", "SOLDS", "TERMINATED"].includes(
          category,
        )
      ) {
        stashListing(item);
        router.push(getListingUrl(item));
      } else {
        router.push((item.access_url || "/").replace(/\?+$/, ""));
      }
      return;
    }

    if (query.trim().length >= 2) {
      setShowResults(false);
      router.push("/real-estate-listings");
    }
  };

  const dropdown =
    showResults && mounted && dropdownRect
      ? createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: dropdownRect.top,
              left: dropdownRect.left,
              width: dropdownRect.width,
              zIndex: 99999,
            }}
          >
            <SearchResultsDropdown
              query={query}
              results={results}
              loading={loading}
              onClose={() => {
                setShowResults(false);
                setQuery("");
              }}
            />
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={searchRef} className="relative w-full">
      <div
        ref={inputWrapRef}
        className="group flex h-14 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 pr-2 shadow-sm transition-all duration-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 sm:h-16"
      >
        <div className="flex flex-1 items-center pl-3">
          <Search
            size={20}
            className="shrink-0 text-slate-400 transition-colors group-focus-within:text-orange-500"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => {
              if (results.length || query.length >= 2) setShowResults(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="Search by city, neighborhood, or building..."
            className="w-full bg-transparent px-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="hidden h-full items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-[0.98] sm:flex"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          aria-label="Search"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 sm:hidden"
        >
          <Search size={20} strokeWidth={3} />
        </button>
      </div>

      {dropdown}
    </div>
  );
}
