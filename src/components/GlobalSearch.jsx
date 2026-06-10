"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import SearchResultsDropdown from "./SearchResultsDropdown";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef(null);

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

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/main-search?q=${encodeURIComponent(query)}`
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
    <div ref={searchRef} className="relative z-[9999] w-full">
      {/* // <div
      <div
  ref={searchRef}
  className="relative z-[9999] w-full"
>
    //   className="absolute left-0 right-0 top-full z-[999] mt-4"
    //   ref={searchRef}
    // > */}
      <div className="flex h-16 items-center rounded-2xl border border-[#E5E7EB] bg-white px-4 transition-all focus-within:border-[#F97316] focus-within:ring-4 focus-within:ring-orange-100">
        <Search size={20} className="text-[#9CA3AF]" />

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          placeholder="Search homes, condos, buildings, locations..."
          className="w-full bg-transparent px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
        />
      </div>

      {showResults && (
        <SearchResultsDropdown
          query={query}
          results={results}
          loading={loading}
          onClose={() => {
            setShowResults(false);
            setQuery("");
          }}
        />
      )}
    </div>
  );
}
