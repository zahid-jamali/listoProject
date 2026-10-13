"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  Bath,
  Heart,
  Share2,
  Building2,
  MapPin,
  ArrowLeft,
  Ruler,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getListingUrl, stashListing } from "@/lib/listing-url";

function titleize(slug = "") {
  return String(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function photoUrl(property) {
  const first = property?.photos?.[0];
  if (typeof first === "string" && first) return first;
  if (first?.url) return first.url;
  if (property?.thumbnail && !String(property.thumbnail).includes("placeholder")) {
    return property.thumbnail;
  }
  return "/assets/buildings.png";
}

const PAGE_SIZE = 24;

export default function InvestorCityPage() {
  const params = useParams();
  const router = useRouter();
  const city = params?.city;
  const cityName = titleize(city || "");

  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("investorFavorites") || "[]"));
    } catch {
      setFavorites([]);
    }
  }, []);

  const toggleFavorite = (property) => {
    const stored = JSON.parse(localStorage.getItem("investorFavorites") || "[]");
    const exists = stored.find((item) => item.id === property.id);
    const updated = exists
      ? stored.filter((item) => item.id !== property.id)
      : [...stored, property];
    localStorage.setItem("investorFavorites", JSON.stringify(updated));
    setFavorites(updated);
    toast.success(exists ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = async (property) => {
    const url = `${window.location.origin}${getListingUrl(property)}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.addr,
          text: property.ad_text,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* user cancelled */
    }
  };

  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [city]);

  useEffect(() => {
    if (!city) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const q = new URLSearchParams({
          munc_slug: city,
          limit: String(limit),
          offset: "0",
          incl_total: "1",
        });
        const res = await fetch(`/api/get_inv_listings?${q}`);
        const data = await res.json();
        if (cancelled) return;
        setProperties(Array.isArray(data?.rows) ? data.rows : []);
        setTotal(Number(data?.total || data?.rows?.length || 0));
      } catch {
        if (!cancelled) {
          setProperties([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [city, limit]);

  const openDetails = (property) => {
    stashListing(property);
    router.push(getListingUrl(property));
  };

  const hasMore = properties.length < total;

  const marketStats = useMemo(() => {
    if (!properties.length) return null;
    const prices = properties
      .map((p) => Number(p.lp_dol))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (!prices.length) return null;
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    return {
      avg: Math.round(avg),
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [properties]);

  return (
    <main className="min-h-screen bg-[#f5f5f5] pb-24">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#04122B]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#F36B22] blur-[100px]" />
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-blue-500 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-[1450px] px-4 py-14 lg:px-8 lg:py-20">
          <Link
            href="/home-and-condos-for-investment"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft size={15} /> All markets
          </Link>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Investor Listings in{" "}
            <span className="text-[#F36B22]">{cityName}</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Curated opportunities with lot-size benchmarks and historical sold
            ranges — powered by LISTO market intelligence.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#F36B22] px-4 py-2 text-sm font-bold text-white">
              {loading ? "Loading…" : `${total.toLocaleString()} Listings`}
            </span>
            {marketStats && (
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                Avg{" "}
                {marketStats.avg.toLocaleString("en-CA", {
                  style: "currency",
                  currency: "CAD",
                  maximumFractionDigits: 0,
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-10 lg:py-14">
        <div className="mx-auto grid max-w-[1450px] grid-cols-1 gap-8 px-4 lg:grid-cols-[1fr_320px] lg:px-8">
          <div>
            {loading && properties.length === 0 ? (
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[240px] animate-pulse rounded-[28px] bg-neutral-200"
                  />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-12 text-center sm:p-16">
                <Building2 className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
                <h3 className="text-xl font-bold text-[#07152E]">
                  No investor listings in {cityName}
                </h3>
                <p className="mt-2 text-sm text-neutral-500">
                  Try another market from the investors page.
                </p>
                <Link
                  href="/home-and-condos-for-investment"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#07152E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102752]"
                >
                  Browse all markets
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {properties.map((property) => {
                  const favorited = favorites.some((f) => f.id === property.id);
                  const hasSoldRange =
                    Number(property.min_sold) > 0 ||
                    Number(property.max_sold) > 0;

                  return (
                    <article
                      key={property.id}
                      className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(0,0,0,0.10)]"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr_160px]">
                        {/* IMAGE */}
                        <button
                          type="button"
                          onClick={() => openDetails(property)}
                          className="relative h-[200px] overflow-hidden md:h-full md:min-h-[240px]"
                        >
                          <img
                            src={photoUrl(property)}
                            alt={property.addr || "Investment listing"}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                          <span className="absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                            {property.photos_total ||
                              property.photos?.length ||
                              0}{" "}
                            Photos
                          </span>
                        </button>

                        {/* BODY */}
                        <div className="p-5 sm:p-6">
                          <div className="flex items-start gap-2 text-xs text-neutral-500">
                            <MapPin size={13} className="mt-0.5 text-[#F36B22]" />
                            <span>
                              {property.community || property.municipality}
                              {property.municipality
                                ? `, ${property.municipality}`
                                : ""}
                            </span>
                          </div>

                          <h3 className="mt-2 line-clamp-2 text-xl font-black tracking-tight text-[#07152E] sm:text-2xl">
                            {property.addr}
                          </h3>

                          {Array.isArray(property.badges1) &&
                            property.badges1.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {property.badges1.slice(0, 4).map((badge, i) => (
                                <span
                                  key={i}
                                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700"
                                >
                                  {badge?.text}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                                Asking price
                              </p>
                              <p className="text-2xl font-black text-[#F36B22] sm:text-3xl">
                                {property.lp_dol_text || "—"}
                              </p>
                            </div>

                            {hasSoldRange && (
                              <div className="rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] px-4 py-2.5">
                                <p className="text-[11px] font-semibold text-neutral-500">
                                  Historical sold range
                                </p>
                                <p className="text-sm font-bold text-[#07152E]">
                                  $
                                  {Number(property.min_sold || 0).toLocaleString()}{" "}
                                  – $
                                  {Number(property.max_sold || 0).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                              <BedDouble size={15} /> {property.br ?? "—"} Beds
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                              <Bath size={15} /> {property.bath_tot ?? "—"} Baths
                            </span>
                            {(property.front_ft || property.depth) && (
                              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF7ED] px-3 py-2 text-sm font-bold text-[#F36B22]">
                                <Ruler size={15} />
                                LOT {property.front_ft || "—"} ×{" "}
                                {property.depth || "—"}
                              </span>
                            )}
                          </div>

                          {property.ad_text && (
                            <p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-600">
                              {property.ad_text}
                            </p>
                          )}

                          {/* Mobile actions */}
                          <div className="mt-5 flex items-center gap-2 xl:hidden">
                            <button
                              type="button"
                              onClick={() => openDetails(property)}
                              className="flex-1 rounded-2xl bg-[#07152E] py-3 text-sm font-bold text-white transition hover:bg-[#102752]"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleFavorite(property)}
                              className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                                favorited
                                  ? "border-red-200 bg-red-50 text-red-500"
                                  : "border-slate-200 text-slate-600"
                              }`}
                              aria-label="Favorite"
                            >
                              <Heart
                                size={16}
                                fill={favorited ? "currentColor" : "none"}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleShare(property)}
                              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600"
                              aria-label="Share"
                            >
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Desktop actions */}
                        <div className="hidden flex-col justify-between border-l border-slate-100 p-4 xl:flex">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                              Lot
                            </p>
                            <p className="mt-2 text-lg font-black text-[#07152E]">
                              {property.front_ft || "—"}′ × {property.depth || "—"}′
                            </p>
                          </div>

                          <div className="mt-4 space-y-3">
                            <div className="flex justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleFavorite(property)}
                                className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
                                  favorited
                                    ? "border-red-200 bg-red-50 text-red-500"
                                    : "border-slate-200 hover:border-red-200 hover:text-red-500"
                                }`}
                              >
                                <Heart
                                  size={16}
                                  fill={favorited ? "currentColor" : "none"}
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleShare(property)}
                                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:border-orange-200 hover:text-[#F36B22]"
                              >
                                <Share2 size={16} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => openDetails(property)}
                              className="w-full rounded-2xl bg-[#07152E] py-3.5 text-sm font-bold text-white transition hover:bg-[#F36B22]"
                            >
                              Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setLimit((l) => l + PAGE_SIZE)}
                      className="rounded-full bg-[#F36B22] px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#d95c1a] disabled:opacity-60"
                    >
                      {loading ? "Loading…" : "Load more listings"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              <div className="rounded-[24px] border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#07152E]">
                  {cityName} Market
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Investment listings selected by LISTO&apos;s algorithm using
                  lot size and neighbourhood sold prices.
                </p>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <dt className="text-neutral-500">Active listings</dt>
                    <dd className="font-bold text-[#07152E]">
                      {total.toLocaleString()}
                    </dd>
                  </div>
                  {marketStats && (
                    <>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <dt className="text-neutral-500">Avg asking</dt>
                        <dd className="font-bold text-[#07152E]">
                          {marketStats.avg.toLocaleString("en-CA", {
                            style: "currency",
                            currency: "CAD",
                            maximumFractionDigits: 0,
                          })}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-neutral-500">Price range</dt>
                        <dd className="font-bold text-[#07152E]">
                          ${(marketStats.min / 1000).toFixed(0)}k – $
                          {(marketStats.max / 1000).toFixed(0)}k
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>

              <Link
                href="/home-and-condos-for-investment"
                className="flex items-center justify-center gap-2 rounded-[24px] border border-[#FED7AA] bg-[#FFF7ED] px-5 py-4 text-sm font-bold text-[#F36B22] transition hover:bg-[#FFEDD5]"
              >
                Browse other markets →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
