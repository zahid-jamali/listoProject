"use client";

import { useEffect, useState } from "react";
import TrendingCard from "./TrendingCard";
import Pagination from "./Pagination";

export default function TrendingGrid({
  page,
  heading,
  crossLine,
  sort = "dom_calc",
  order = "asc",
}) {
  const [listings, setListings] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const LIMIT = 9;

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);

        const offset = Math.max(0, (Number(page) - 1) * LIMIT);
        const res = await fetch(
          `/api/listings?type=RS&limit=${LIMIT}&offset=${offset}&sort=${encodeURIComponent(sort)}&order=${encodeURIComponent(order)}`,
        );

        const data = await res.json();
        if (cancelled) return;

        setListings(data.rows || []);
        setCount(Number(data.total || data.count || 0));
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [page, sort, order]);

  const totalPages = Math.ceil(count / LIMIT);

  return (
    <section className="max-w-7xl mx-auto px-5 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-black tracking-tight text-[#07162E]">
          {/* Trending Properties */}
          {heading}
        </h1>

        <p className="mt-3 text-gray-500">
          {/* Discover the most viewed and fastest moving listings. */}
          {crossLine}
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-[470px] rounded-2xl bg-white animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
            {listings.map((listing) => (
              <TrendingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      )}
    </section>
  );
}
