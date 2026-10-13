"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BedDouble,
  Bath,
  MoveHorizontal,
  MapPin,
  Trash2,
  ChevronRight,
  Scale,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getListingUrl, stashListing } from "@/lib/listing-url";

const STORAGE_KEY = "Compare";

export function readCompareList() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeCompareList(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
  // Notify the navbar (same tab) so the badge stays in sync.
  window.dispatchEvent(new Event("compare:updated"));
}

const ATTRIBUTES = [
  { key: "lp_dol_text", label: "Price", highlight: true },
  { key: "type_label", label: "Type" },
  { key: "br", label: "Beds", icon: BedDouble },
  { key: "bath_tot", label: "Baths", icon: Bath },
  { key: "sqft", label: "Sq Ft", icon: MoveHorizontal },
  { key: "id", label: "MLS #" },
  { key: "community", label: "Community" },
  { key: "municipality", label: "Municipality" },
];

function valueFor(item, key) {
  if (key === "type_label") {
    return item.s_r || item.sub_type2 || item.sub_type || "—";
  }
  const v = item?.[key];
  return v === 0 || v ? v : "—";
}

export default function CompareModal({ isOpen, onClose }) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) setItems(readCompareList());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const removeItem = (id) => {
    const next = items.filter((it) => it.id !== id);
    setItems(next);
    writeCompareList(next);
    toast.success("Removed from compare");
  };

  const clearAll = () => {
    setItems([]);
    writeCompareList([]);
    toast.success("Compare list cleared");
  };

  const openListing = (item) => {
    stashListing(item);
    onClose?.();
    router.push(getListingUrl(item));
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#F58232]">
                  <Scale size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900">
                    Compare Properties
                  </h2>
                  <p className="text-xs text-slate-400">
                    {items.length} {items.length === 1 ? "property" : "properties"} selected
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close compare"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                  <Scale size={30} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No properties to compare yet
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Tap the “Compare” button on any listing card to add it here and
                  view them side by side.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 rounded-full bg-[#081A3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102752]"
                >
                  Browse listings
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-auto">
                  <div className="min-w-max">
                    {/* Property cards row */}
                    <div className="flex gap-4 p-6 pb-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="w-56 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                          <div className="relative h-32">
                            <img
                              src={item.thumbnail}
                              alt={item.addr || "Property"}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500"
                              aria-label="Remove"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="p-3">
                            <p className="truncate text-base font-black text-slate-900">
                              {item.lp_dol_text || "—"}
                            </p>
                            <p className="mt-0.5 line-clamp-2 flex items-start gap-1 text-xs text-slate-500">
                              <MapPin size={12} className="mt-0.5 shrink-0" />
                              {item.addr}
                            </p>
                            <button
                              type="button"
                              onClick={() => openListing(item)}
                              className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-[#F58232] py-2 text-xs font-bold text-white transition hover:bg-[#e67428]"
                            >
                              View Details
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Attribute rows */}
                    <div className="px-6 pb-6">
                      <div className="overflow-hidden rounded-2xl border border-slate-100">
                        {ATTRIBUTES.map((attr, rowIdx) => (
                          <div
                            key={attr.key}
                            className={`flex ${rowIdx % 2 ? "bg-white" : "bg-slate-50/60"}`}
                          >
                            <div className="sticky left-0 flex w-32 shrink-0 items-center gap-2 border-r border-slate-100 bg-inherit px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                              {attr.icon && <attr.icon size={13} />}
                              {attr.label}
                            </div>
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className={`w-56 shrink-0 px-4 py-3 text-sm ${
                                  attr.highlight
                                    ? "font-black text-[#F58232]"
                                    : "font-medium text-slate-700"
                                }`}
                              >
                                {valueFor(item, attr.key)}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                    Clear all
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full bg-[#081A3A] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102752]"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
