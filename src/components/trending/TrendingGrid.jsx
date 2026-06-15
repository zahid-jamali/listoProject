"use client";

import { useEffect, useState } from "react";
import TrendingCard from "./TrendingCard";
import Pagination from "./Pagination";

export default function TrendingGrid({ page, heading, crossLine }) {
  const [listings, setListings] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const LIMIT = 9;

  useEffect(() => {
    fetchData();
  }, [page]);

  async function fetchData() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/listings?type=RS&page=${page}&limit=${LIMIT}&sort=dom_calc`,
      );

      const data = await res.json();

      setListings(data.rows || []);
      setCount(data.count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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
