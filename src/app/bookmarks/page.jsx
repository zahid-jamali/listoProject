"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, Eye, Search, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ListingCards from "@/components/ListingCards";
import toast from "react-hot-toast";

function BookmarksContent() {
  const { isLoggedIn, token } = useAuth();
  const sp = useSearchParams();
  const activeTab = sp.get("tab") === "watchlist" ? "watchlist" : "bookmarks";

  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavs = async () => {
    if (!isLoggedIn) {
      setFavs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/favs", { headers });
      if (res.ok) {
        const data = await res.json();
        const rows = data?.rows || (Array.isArray(data) ? data : []);
        setFavs(rows);
      } else {
        setFavs([]);
      }
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
      setFavs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavs();
  }, [isLoggedIn, token]);

  const handleRemove = async (item) => {
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/fav", {
        method: "DELETE",
        headers,
        body: JSON.stringify({
          id: item.id || item.prop_id,
          type: item.type || "RS",
          brd: item.brd || "",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        setFavs((prev) =>
          prev.filter(
            (f) => String(f.id || f.prop_id) !== String(item.id || item.prop_id),
          ),
        );
        toast.success("Removed from saved listings");
      } else {
        toast.error(data.message || "Could not remove listing");
      }
    } catch {
      toast.error("Error removing listing");
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8] pb-20 pt-28 lg:pt-32">
      <div className="mx-auto max-w-[1450px] px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F36B22]">
              Saved Properties
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#0B132B] sm:text-3xl">
              {activeTab === "watchlist" ? "My Watchlist" : "My Bookmarks"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Properties you have bookmarked and tracked across Ontario.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/bookmarks"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                activeTab === "bookmarks"
                  ? "bg-[#0B132B] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#F36B22]"
              }`}
            >
              <Bookmark size={14} />
              Bookmarks ({favs.length})
            </Link>
            <Link
              href="/bookmarks?tab=watchlist"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                activeTab === "watchlist"
                  ? "bg-[#0B132B] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#F36B22]"
              }`}
            >
              <Eye size={14} />
              Watchlist
            </Link>
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Bookmark className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Sign in to view your saved properties
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Bookmark homes, condos, and pre-construction developments to track price updates and compare your top picks.
            </p>
            <Link
              href="/real-estate-listings"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F36B22] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#d95c1a]"
            >
              <Search size={16} />
              Browse Listings
            </Link>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[360px] animate-pulse rounded-[24px] bg-slate-200"
              />
            ))}
          </div>
        ) : favs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-14 text-center">
            <Bookmark className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-4 text-lg font-bold text-slate-800">
              No saved properties yet
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Click the bookmark icon on any listing card to save it here for quick access.
            </p>
            <Link
              href="/real-estate-listings"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F36B22] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#d95c1a]"
            >
              Explore Active Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {favs.map((item, idx) => (
              <div key={item.id || item.prop_id || idx} className="relative">
                <ListingCards listing={item} />
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  title="Remove from saved"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function BookmarksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f6f8] pt-32 text-center text-sm text-slate-500">
          Loading saved properties…
        </div>
      }
    >
      <BookmarksContent />
    </Suspense>
  );
}
