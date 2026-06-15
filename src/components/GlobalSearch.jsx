"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import SearchResultsDropdown from "./SearchResultsDropdown";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  const searchRef = useRef(null);
  const inputWrapperRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  // Recalculate dropdown position when shown
  useEffect(() => {
    if (showResults && inputWrapperRef.current) {
      const rect = inputWrapperRef.current.getBoundingClientRect();
      setDropdownTop(rect.bottom + window.scrollY + 8);
      setDropdownLeft(rect.left + window.scrollX);
      setDropdownWidth(rect.width);
    }
  }, [showResults, results]);

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
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={searchRef} className="relative w-full">
      <div
        ref={inputWrapperRef}
        className="flex h-16 items-center rounded-2xl border border-[#E5E7EB] bg-white px-4 transition-all focus-within:border-[#F97316] focus-within:ring-4 focus-within:ring-orange-100"
      >
        <Search size={20} className="shrink-0 text-[#9CA3AF]" />

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => {
            if (results.length) setShowResults(true);
          }}
          placeholder="Search homes, condos, buildings, locations..."
          className="w-full bg-transparent px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
        />
      </div>

      {/* Portal-style fixed dropdown — escapes any stacking context */}
      {showResults && (
        <div
          className="fixed z-[99999]"
          style={{
            top: dropdownTop,
            left: dropdownLeft,
            width: dropdownWidth,
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
        </div>
      )}
    </div>
  );
}
