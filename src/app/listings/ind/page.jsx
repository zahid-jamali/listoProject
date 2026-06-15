"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  Share2,
  Heart,
  Trees,
  Bus,
  Bike,
  ArrowLeft,
  ImageIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const TABS = [
  { id: "property", label: "Property" },
  { id: "details", label: "Details" },
  { id: "rooms", label: "Room Sizes" },
];

const TREND_LINES = [
  { key: "detached_avg_sold_price", color: "#FF5C5C", label: "Detached" },
  { key: "semi_detached_avg_sold_price", color: "#20C997", label: "Semi" },
  {
    key: "twnhouse_avg_sold_price",
    color: "#3B82F6",
    label: "Townhouse",
  },
  { key: "condo_apt_avg_sold_price", color: "#8B5CF6", label: "Condo" },
];

function formatCurrency(value) {
  const num = Number(String(value || "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num)) return value || "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(num);
}

function statusBadgeClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("sold")) return "bg-slate-500";
  if (normalized.includes("lease")) return "bg-blue-500";
  return "bg-[#F58232]";
}

function ListingDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("property");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState(null);

  const loadListing = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let listing = null;

      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("listing");
        if (stored) {
          listing = JSON.parse(stored);
        }
      }

      const id = searchParams.get("id");
      const type = searchParams.get("type") || "RS";
      const brd = searchParams.get("brd");

      if (!listing && id) {
        const params = new URLSearchParams({ type, id, limit: "1", out: "M" });
        const listingRes = await fetch(`/api/listings?${params}`);
        const listingData = await listingRes.json();
        listing = listingData?.rows?.[0] || null;
      }

      if (!listing) {
        setError("No listing selected. Browse listings and choose a property.");
        return;
      }

      const payload = brd ? { ...listing, brd } : listing;

      const res = await fetch("/api/singleListing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const pageData = await res.json();

      if (!pageData.success) {
        setError(pageData.message || "Unable to load listing details.");
        return;
      }

      setData(pageData);
      setCalculatorInputs(pageData.calculator?.inputs || null);
      sessionStorage.setItem("listing", JSON.stringify(pageData.property));
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading this property.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadListing();
  }, [loadListing]);

  const photos = data?.hero?.photos || [];
  const hero = data?.hero;
  const details = data?.details;
  const neighborhood = data?.neighborhood;
  const activeComps = data?.comparisons?.active || [];
  const soldComps = data?.comparisons?.sold || [];
  const insights = data?.insights || [];

  const chartData = useMemo(() => {
    return (data?.marketTrends || [])
      .slice(0, 6)
      .reverse()
      .map((item) => ({
        month: new Date(item.date).toLocaleDateString("en-CA", {
          month: "short",
        }),
        detached: Number(item.detached_avg_sold_price) / 1000 || 0,
        semi: Number(item.semi_detached_avg_sold_price) / 1000 || 0,
        townhouse: Number(item.twnhouse_avg_sold_price) / 1000 || 0,
        condo: Number(item.condo_apt_avg_sold_price) / 1000 || 0,
      }));
  }, [data?.marketTrends]);

  const calculatorResults = useMemo(() => {
    if (!calculatorInputs) return data?.calculator?.results;

    const homePrice = Number(calculatorInputs.homePrice) || 0;
    const downPaymentPercent = Number(calculatorInputs.downPaymentPercent) || 20;
    const interestRate = Number(calculatorInputs.interestRate) || 5.4;
    const termYears = Number(calculatorInputs.termYears) || 25;

    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const months = termYears * 12;
    const mortgageMonthly =
      monthlyRate === 0
        ? loanAmount / months
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
    const propertyTaxMonthly = (homePrice * 0.004) / 12;
    const estimatedMonthly = mortgageMonthly + propertyTaxMonthly;

    return {
      downPayment,
      loanAmount,
      mortgageMonthly,
      propertyTaxMonthly,
      closingCostsEstimate: homePrice * 0.0175,
      estimatedMonthly,
      affordabilityScore: data?.calculator?.results?.affordabilityScore,
    };
  }, [calculatorInputs, data?.calculator?.results]);

  const mapUrl =
    neighborhood?.lat && neighborhood?.lng
      ? `https://maps.google.com/maps?q=${neighborhood.lat},${neighborhood.lng}&z=15&output=embed`
      : null;

  const openGallery = (index = 0) => {
    setPhotoIndex(index);
    setGalleryOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-[#F58232] border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">
            Loading property details…
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-6">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#F58232]">
            <MapPin size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Listing unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#081A3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102752]"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {galleryOpen && photos.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <button
            type="button"
            onClick={() => setGalleryOpen(false)}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>
          <button
            type="button"
            onClick={() =>
              setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
            }
            className="absolute left-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={28} />
          </button>
          <img
            src={photos[photoIndex]?.src}
            alt={`${hero?.title} photo ${photoIndex + 1}`}
            className="max-h-[88vh] max-w-[92vw] object-contain"
          />
          <button
            type="button"
            onClick={() => setPhotoIndex((prev) => (prev + 1) % photos.length)}
            className="absolute right-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={28} />
          </button>
          <div className="absolute bottom-6 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
            {photoIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#f5f5f5] pb-20">
        <section className="mx-auto max-w-7xl px-4 pt-6 lg:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#F58232]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="relative overflow-hidden rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <div className="relative h-[420px] md:h-[520px]">
              {hero?.heroImage ? (
                <img
                  src={hero.heroImage}
                  alt={hero.title || "Property"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-200">
                  <ImageIcon size={48} className="text-slate-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                {(hero?.badges || []).slice(0, 3).map((badge) => (
                  <span
                    key={badge.text}
                    className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur-md"
                  >
                    {badge.text}
                  </span>
                ))}
              </div>

              <div className="absolute right-5 top-5 flex gap-2">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 backdrop-blur-md transition hover:bg-white"
                >
                  <Share2 size={16} />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 backdrop-blur-md transition hover:bg-white"
                >
                  <Heart size={16} />
                </button>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-300">
                    {details?.saleType || "For Sale"}
                  </p>
                  <h1 className="mt-2 text-3xl font-black text-white md:text-5xl">
                    {hero?.title}
                  </h1>
                  <p className="mt-2 flex items-center gap-2 text-sm text-white/80 md:text-base">
                    <MapPin size={16} />
                    {hero?.subtitle}
                  </p>
                </div>

                {photos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => openGallery(0)}
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-orange-50"
                  >
                    View {photos.length} photos
                  </button>
                )}
              </div>
            </div>

            {photos.length > 1 && (
              <div className="grid grid-cols-4 gap-1 bg-black p-1 md:grid-cols-6">
                {photos.slice(0, 6).map((photo, index) => (
                  <button
                    key={photo.src}
                    type="button"
                    onClick={() => openGallery(index)}
                    className="relative aspect-[4/3] overflow-hidden"
                  >
                    <img
                      src={photo.src}
                      alt=""
                      className="h-full w-full object-cover transition hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative z-10 -mt-8 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 rounded-[24px] bg-white px-6 py-7 shadow-[0_16px_40px_rgba(0,0,0,0.12)] md:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Listing price
              </p>
              <p className="mt-1 text-3xl font-black text-slate-900 md:text-4xl">
                {hero?.priceText || formatCurrency(hero?.price)}
              </p>
            </div>

            <div className="flex gap-8 md:gap-12">
              <Stat icon={BedDouble} value={hero?.beds} label="Beds" />
              <Stat icon={Bath} value={hero?.baths} label="Baths" />
              <Stat icon={Ruler} value={hero?.sqft} label="Sqft" />
            </div>

            <span
              className={`rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wide text-white ${statusBadgeClass(hero?.status)}`}
            >
              {hero?.status}
            </span>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-7xl gap-8 px-4 lg:grid-cols-[1.6fr_1fr] lg:px-6">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[24px] bg-[#06132e] shadow-xl">
              <div className="flex gap-6 border-b border-white/10 px-8 pt-6">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? "border-b-2 border-[#F58232] text-[#F58232]"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-6 p-8 text-white md:grid-cols-3">
                {activeTab === "property" && (
                  <>
                    <DetailItem label="MLS ID" value={details?.mlsId} />
                    <DetailItem label="Property Type" value={details?.propertyType} />
                    <DetailItem label="Status" value={details?.status} />
                    <DetailItem label="Style" value={details?.propertyStyle} />
                    <DetailItem label="Exterior" value={details?.exterior || "—"} />
                    <DetailItem label="Year Built" value={details?.yearBuilt || "—"} />
                  </>
                )}

                {activeTab === "details" && (
                  <>
                    <DetailItem label="Class" value={details?.propertyClass} />
                    <DetailItem label="Taxes" value={details?.taxes || "—"} />
                    <DetailItem label="Maintenance" value={details?.maintenance || "—"} />
                    <DetailItem label="Parking" value={details?.parking || "—"} />
                    <DetailItem label="Pool" value={details?.pool || "—"} />
                    <DetailItem label="Cross Street" value={details?.crossStreet || "—"} />
                  </>
                )}

                {activeTab === "rooms" && (
                  <>
                    <DetailItem label="Bedrooms" value={hero?.beds} />
                    <DetailItem label="Bathrooms" value={hero?.baths} />
                    <DetailItem label="Living Area" value={hero?.sqft} />
                    <DetailItem label="Lot Width" value={details?.lotWidth || "—"} />
                    <DetailItem label="Lot Depth" value={details?.lotDepth || "—"} />
                    <DetailItem label="Property Style" value={details?.propertyStyle} />
                  </>
                )}
              </div>
            </div>

            {details?.features?.length > 0 && (
              <div className="rounded-[24px] bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Property Features
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {details.features.map((feature) => (
                    <div
                      key={feature}
                      className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeComps.length > 0 || soldComps.length > 0) && (
              <div className="rounded-[24px] bg-white p-8 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-[#F58232]" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Market Comparisons
                  </h2>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Compare this listing with nearby active and sold properties.
                </p>

                <div className="mt-6 space-y-4">
                  {activeComps.slice(0, 2).map((comp) => (
                    <ComparisonCard key={comp.id} comp={comp} tone="active" />
                  ))}
                  {soldComps.slice(0, 2).map((comp) => (
                    <ComparisonCard key={`sold-${comp.id}`} comp={comp} tone="sold" />
                  ))}
                </div>
              </div>
            )}

            {insights.length > 0 && (
              <div className="rounded-[24px] border border-orange-100 bg-orange-50 p-8">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-[#F58232]" />
                  <h2 className="text-xl font-bold text-orange-700">
                    Local Insights
                  </h2>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {insights.slice(0, 4).map((item) => (
                    <div
                      key={`${item.id}-${item.insight}`}
                      className="rounded-2xl bg-white/80 p-4 shadow-sm"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#F58232]">
                        {item.insight_desc}
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {item.addr}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatCurrency(item.lp_dol)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chartData.length > 0 && (
              <div className="rounded-[24px] bg-[#00132D] p-6 shadow-xl">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {neighborhood?.municipality || "Area"} home prices
                    </h2>
                    <p className="mt-1 text-xs text-[#F58232]">
                      6-month valuation trend across asset classes
                    </p>
                  </div>
                </div>

                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid stroke="#233149" vertical={false} />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#fff", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#fff", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `$${v}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "none",
                          borderRadius: 12,
                          color: "#fff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="detached"
                        stroke="#FF5C5C"
                        strokeWidth={3}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="semi"
                        stroke="#20C997"
                        strokeWidth={3}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="townhouse"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="condo"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-6">
                  {TREND_LINES.map((line) => (
                    <div key={line.key} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ background: line.color }}
                      />
                      <span className="text-[11px] uppercase tracking-wide text-white">
                        {line.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[24px] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Estimated monthly
              </p>
              <p className="mt-2 text-4xl font-black text-slate-900">
                {formatCurrency(calculatorResults?.estimatedMonthly)}
                <span className="text-base font-medium text-slate-400"> /mo</span>
              </p>

              {calculatorInputs && (
                <div className="mt-6 space-y-4">
                  <SliderField
                    label="Down payment"
                    value={calculatorInputs.downPaymentPercent}
                    suffix="%"
                    min={5}
                    max={50}
                    step={5}
                    onChange={(value) =>
                      setCalculatorInputs((prev) => ({
                        ...prev,
                        downPaymentPercent: value,
                      }))
                    }
                  />
                  <SliderField
                    label="Interest rate"
                    value={calculatorInputs.interestRate}
                    suffix="%"
                    min={2}
                    max={10}
                    step={0.1}
                    onChange={(value) =>
                      setCalculatorInputs((prev) => ({
                        ...prev,
                        interestRate: value,
                      }))
                    }
                  />
                </div>
              )}

              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
                <CalcRow
                  label="Loan amount"
                  value={formatCurrency(calculatorResults?.loanAmount)}
                />
                <CalcRow
                  label="Down payment"
                  value={formatCurrency(calculatorResults?.downPayment)}
                />
                <CalcRow
                  label="Property tax (est.)"
                  value={`${formatCurrency(calculatorResults?.propertyTaxMonthly)} / mo`}
                />
              </div>

              {calculatorResults?.affordabilityScore && (
                <div className="mt-5 rounded-2xl bg-green-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-green-700">
                    Affordability score
                  </p>
                  <p className="text-2xl font-black text-green-800">
                    {calculatorResults.affordabilityScore}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-[24px] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-lg">
                  {data.contact?.agent?.thumbnail ? (
                    <img
                      src={data.contact.agent.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "👤"
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {data.contact?.agent?.name || "Listing Agent"}
                  </h3>
                  <p className="text-sm text-slate-500">Contact agent</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {data.contact?.agent?.phone && (
                  <a
                    href={`tel:${data.contact.agent.phone}`}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-[#F58232]"
                  >
                    <Phone size={15} />
                    Call
                  </a>
                )}
                {data.contact?.agent?.email && (
                  <a
                    href={`mailto:${data.contact.agent.email}`}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-[#F58232]"
                  >
                    <Mail size={15} />
                    Email
                  </a>
                )}
              </div>

              <textarea
                defaultValue={data.contact?.defaultMessage}
                rows={3}
                className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#F58232]"
              />
              <button
                type="button"
                className="mt-3 w-full rounded-full bg-[#F58232] py-3 text-sm font-semibold text-white transition hover:bg-[#e67428]"
              >
                Send inquiry
              </button>
            </div>

            <div className="rounded-[24px] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Neighborhood Overview
              </h3>
              <div className="mt-5 space-y-5">
                <ScoreRow
                  icon={<Trees size={18} />}
                  title="Walk Score"
                  score={neighborhood?.walkscore || "—"}
                  desc={neighborhood?.community || neighborhood?.municipality}
                />
                <ScoreRow
                  icon={<Bus size={18} />}
                  title="Transit"
                  score="Good"
                  desc="Public transportation nearby"
                />
                <ScoreRow
                  icon={<Bike size={18} />}
                  title="Bikeable"
                  score="Moderate"
                  desc="Some bike infrastructure"
                />
              </div>
            </div>
          </aside>
        </section>

        <section className="mx-auto mt-10 max-w-7xl px-4 lg:px-6">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Location
          </h2>
          <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">
            {mapUrl ? (
              <iframe
                title="Property location map"
                src={mapUrl}
                className="h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-[320px] items-center justify-center bg-slate-100 text-slate-500">
                Map unavailable for this listing
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="text-center">
      <Icon className="mx-auto mb-2 text-[#F58232]" size={20} />
      <p className="text-xl font-bold text-slate-900">{value || "—"}</p>
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 font-medium">{value || "—"}</p>
    </div>
  );
}

function ComparisonCard({ comp, tone }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-100 p-4">
      <div className="flex min-w-0 flex-1 gap-4">
        {comp.thumbnail && (
          <img
            src={comp.thumbnail}
            alt=""
            className="h-20 w-28 rounded-xl object-cover"
          />
        )}
        <div>
          <p className="text-xl font-bold text-slate-900">
            {comp.lp_dol_text || formatCurrency(comp.lp_dol)}
          </p>
          <p className="font-medium text-slate-700">{comp.addr}</p>
          <p className="text-sm text-slate-500">
            {[comp.community, comp.municipality].filter(Boolean).join(" • ")}
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{comp.br} beds</span>
            <span>{comp.bath_tot} baths</span>
            <span>{comp.sqft} sqft</span>
          </div>
        </div>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
          tone === "sold"
            ? "bg-slate-100 text-slate-600"
            : "bg-green-50 text-green-700"
        }`}
      >
        {tone === "sold" ? "Sold" : comp.listing_text || "Active"}
      </span>
    </div>
  );
}

function CalcRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function SliderField({ label, value, suffix, min, max, step, onChange }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer accent-[#F58232]"
      />
    </div>
  );
}

function ScoreRow({ icon, title, score, desc }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-[4px] border-[#F58232] bg-white text-lg font-bold text-slate-900">
        {score}
      </div>
      <div>
        <div className="flex items-center gap-2 font-bold text-slate-900">
          {icon}
          {title}
        </div>
        <p className="mt-1 text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function ListingPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-[#F58232] border-t-transparent" />
        <p className="text-sm font-medium text-slate-600">
          Loading property details…
        </p>
      </div>
    </div>
  );
}

export default function ListingDetailPage() {
  return (
    <Suspense fallback={<ListingPageFallback />}>
      <ListingDetailContent />
    </Suspense>
  );
}
