"use client";

import { useState, useEffect } from "react";
import { BookmarkIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import AuthGate from "./AuthGate";

export default function Bookmark({ listing, className = "" }) {
  const { isLoggedIn, token } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGate, setShowGate] = useState(false);

  // Check if this property is bookmarked on mount / login status change
  useEffect(() => {
    if (!isLoggedIn || !listing?.id) {
      setIsBookmarked(false);
      return;
    }

    const checkBookmarkStatus = async () => {
      try {
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await fetch("/api/favs",  {headers});
        if (res.ok) {
          const data = await res.json();
          // The API returns favorites in data.rows or data
          const favs = data?.rows || data || [];
          const exists = favs.some(
            (fav) => String(fav.id || fav.prop_id) === String(listing.id)
          );
          setIsBookmarked(exists);
        }
      } catch (err) {
        console.error("Error checking bookmark status:", err);
      }
    };

    checkBookmarkStatus();
  }, [isLoggedIn, listing?.id, token]);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      setShowGate(true);
      return;
    }

    if (loading) return;

    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      if (isBookmarked) {
        // Remove bookmark
        const res = await fetch("/api/fav", {
          method: "DELETE",
          headers,
          body: JSON.stringify({
            id: listing.id,
            type: listing.type || "RS",
            brd: listing.brd || "",
          }),
        });

        const data = await res.json();
        if (res.ok && data.success !== false) {
          setIsBookmarked(false);
          toast.success("Bookmark removed successfully");
        } else {
          toast.error(data.message || "Failed to remove bookmark");
        }
      } else {
        // Add bookmark
        const res = await fetch("/api/fav", {
          method: "POST",
          headers,
          body: JSON.stringify({
            id: listing.id,
            type: listing.type || "RS",
            brd: listing.brd || "",
          }),
        });

        const data = await res.json();
        if (res.ok && data.success !== false) {
          setIsBookmarked(true);
          toast.success("Property bookmarked successfully");
        } else {
          toast.error(data.message || "Failed to bookmark property");
        }
      }
    } catch (err) {
      console.error("Bookmark API Error:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleBookmarkToggle}
        disabled={loading}
        className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-200 focus:outline-none ${
          isBookmarked
            ? "border-[#F97316] bg-[#F97316]/10 text-[#F97316]"
            : "border-[#E5E7EB] text-[#6B7280] hover:border-[#F97316] hover:text-[#F97316]"
        } ${className}`}
        title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      >
        <BookmarkIcon
          size={15}
          className={`${isBookmarked ? "fill-current" : ""} ${loading ? "opacity-50" : ""}`}
        />
      </button>

      {showGate && !isLoggedIn && (
        <AuthGate
          title="Sign in to bookmark"
          description="Create a free account or sign in to save your favorite listings and access them from any device."
          dismissable={true}
          onClose={() => setShowGate(false)}
        >
          <div className="hidden" />
        </AuthGate>
      )}
    </>
  );
}
