"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Building2, Calendar, DollarSign, ExternalLink } from "lucide-react";
import Bookmark from "../Bookmark";

export default function ProjectQuickViewModal({ isOpen, onClose, listing, onFullDetails }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [details, setDetails] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (!isOpen || !listing) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/project-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listing),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch project details");
        }

        const data = await res.json();
        if (data?.success) {
          setDetails(data);
          setPhotos(data?.hero?.photos || []);
        } else {
          throw new Error(data?.message || "Failed to load project details");
        }
      } catch (err) {
        console.error("Modal fetch error:", err);
        setError("Unable to load project details from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, listing]);

  if (!isOpen) return null;

  const displayPhotos = photos.length > 0 ? photos : [{ src: listing?.thumbnail }];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#091426] text-white border border-white/10 shadow-2xl p-4 sm:p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors focus:outline-none z-10"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#F58232] border-t-transparent" />
            <p className="mt-4 text-slate-400 text-sm font-medium">Fetching details from server...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-950/30 text-red-500 border border-red-500/20">
              <Building2 size={28} />
            </div>
            <h3 className="text-xl font-bold">Error Loading Project</h3>
            <p className="mt-2 text-slate-400 text-sm">{error}</p>
            <button
              onClick={onClose}
              className="mt-6 rounded-2xl bg-white/10 hover:bg-white/15 px-6 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {/* Left Column: Media & Photos */}
            <div className="space-y-4">
              <div className="relative h-[250px] sm:h-[320px] rounded-2xl overflow-hidden bg-slate-900 border border-white/5">
                <img
                  src={displayPhotos[activePhoto]?.src || displayPhotos[activePhoto]?.thumbnail || "https://placehold.co/600x400"}
                  alt={listing?.title || "Project Photo"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {displayPhotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {displayPhotos.slice(0, 5).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activePhoto === i ? "border-[#F58232] scale-105" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.src || img.thumbnail}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: details */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#F58232] border border-orange-500/20">
                    <Building2 size={12} />
                    Pre-construction
                  </span>
                  <div className="flex items-center gap-2">
                    <Bookmark listing={listing} className="h-9 w-9 bg-white/5 hover:bg-white/10" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">{listing?.title}</h2>
                  <p className="text-slate-400 text-sm font-semibold mt-1">Developed by {listing?.developer_name || "Premier Developer"}</p>
                </div>

                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <MapPin size={16} className="text-[#F58232] shrink-0" />
                  <span>{listing?.addr}</span>
                </div>

                <div className="py-3 border-y border-white/10 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">Starting Price</span>
                    <span className="text-xl font-bold text-[#F58232]">{listing?.lp_dol_text || "Pricing TBD"}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">Occupancy</span>
                    <span className="text-xl font-bold text-[#F58232]">{details?.details?.yearBuilt || "TBD"}</span>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">MLS® ID:</span>
                    <span className="font-semibold">{details?.details?.mlsId || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Exterior Finish:</span>
                    <span className="font-semibold">{details?.details?.exterior || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Parking Spaces:</span>
                    <span className="font-semibold">{details?.details?.parking || "TBD"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={onFullDetails}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#F58232] hover:bg-[#e67428] px-6 py-3.5 text-sm font-bold text-white transition-colors focus:outline-none shadow-lg shadow-orange-950/20"
                >
                  <ExternalLink size={16} />
                  View Full Details
                </button>
                <button
                  onClick={onClose}
                  className="rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-colors focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
