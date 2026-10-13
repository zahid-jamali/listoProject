"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  ArrowLeft,
  Home,
  DollarSign,
  Clock,
  Eye,
  ImageIcon,
} from "lucide-react";
import { getListingUrl, stashListing } from "@/lib/listing-url";
import {
  parseBuildingPath,
  readStashedBuilding,
} from "@/lib/building-url";

function fixPhoto(url) {
  if (!url) return null;
  const idx = url.indexOf("https://trreb-image");
  if (idx !== -1) return url.substring(idx);
  if (url.startsWith("https://images.listo.ca/https://"))
    return url.replace("https://images.listo.ca/", "");
  if (url.startsWith("/") && !url.startsWith("//"))
    return `https://listo.ca${url}`;
  return url;
}

function fmtCurrency(v) {
  const n = Number(String(v || "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(n) || n === 0) return v || "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
}

function parseStatText(html = "") {
  const clean = String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const match = clean.match(/^(\d+)\s+unit[s]?\s+(.+)$/i);
  if (match) return { count: match[1], label: match[2].trim() };
  return { count: "", label: clean };
}

function titleize(slug = "") {
  return String(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

const BR_COLORS = {
  br1: "#F58232",
  br2: "#3B82F6",
  br3: "#10B981",
  br4: "#8B5CF6",
};
const BR_LABELS = { br1: "Studio", br2: "1 Bed", br3: "2 Bed", br4: "3+ Bed" };
const PAGE = 6;

export default function BuildingPage() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const parsed = parseBuildingPath(pathname);
  const slug = parsed?.addr_slug || params?.slug;

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [saleData, setSaleData] = useState({ rows: [], total: 0, available: true });
  const [leaseData, setLeaseData] = useState({ rows: [], total: 0, available: true });
  const [saleStats, setSaleStats] = useState([]);
  const [leaseStats, setLeaseStats] = useState([]);
  const [chart, setChart] = useState([]);
  const [activeTab, setActiveTab] = useState("lease");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [saleOffset, setSaleOffset] = useState(0);
  const [leaseOffset, setLeaseOffset] = useState(0);

  useEffect(() => {
    if (!slug) return;

    // Instant hydrate from list-page stash
    const stashed = readStashedBuilding(slug);
    if (stashed?.addr_slug === slug || stashed?.addr_slug) {
      setSummary(stashed);
    }

    const load = async () => {
      try {
        setLoading(true);
        const [
          saleRes,
          leaseRes,
          saleStatsRes,
          leaseStatsRes,
          chartRes,
        ] = await Promise.allSettled([
          fetch(`/api/building?addr_slug=${encodeURIComponent(slug)}&s_r=Sale&limit=50`),
          fetch(`/api/building?addr_slug=${encodeURIComponent(slug)}&s_r=Lease&limit=50`),
          fetch(`/api/building/stats?addr_slug=${encodeURIComponent(slug)}&s_r=Sale&type=RS`),
          fetch(`/api/building/stats?addr_slug=${encodeURIComponent(slug)}&s_r=Lease&type=RS`),
          fetch(`/api/building/sold-chart?addr_slug=${encodeURIComponent(slug)}&s_r=Sale&type=RS`),
        ]);

        const parse = async (settled) => {
          if (settled.status !== "fulfilled") return null;
          try {
            return await settled.value.json();
          } catch {
            return null;
          }
        };

        const saleJson = await parse(saleRes);
        const leaseJson = await parse(leaseRes);
        const saleStatsJson = await parse(saleStatsRes);
        const leaseStatsJson = await parse(leaseStatsRes);
        const chartJson = await parse(chartRes);

        const nextSummary =
          saleJson?.summary || leaseJson?.summary || stashed || null;
        if (nextSummary) setSummary(nextSummary);

        setSaleData({
          rows: saleJson?.rows || [],
          total: Number(saleJson?.total || saleJson?.summary?.count_sale || 0),
          available: saleJson?.listings_available !== false,
        });
        setLeaseData({
          rows: leaseJson?.rows || [],
          total: Number(leaseJson?.total || leaseJson?.summary?.count_lease || 0),
          available: leaseJson?.listings_available !== false,
        });

        setSaleStats(Array.isArray(saleStatsJson) ? saleStatsJson : []);
        setLeaseStats(Array.isArray(leaseStatsJson) ? leaseStatsJson : []);
        setChart(Array.isArray(chartJson) ? chartJson : []);

        // Prefer tab with data
        const leaseCount = Number(
          leaseJson?.total || leaseJson?.summary?.count_lease || 0,
        );
        const saleCount = Number(
          saleJson?.total || saleJson?.summary?.count_sale || 0,
        );
        if (leaseCount === 0 && saleCount > 0) setActiveTab("sale");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  const heroImg =
    fixPhoto(summary?.thumbnail) || "/assets/buildings.png";
  const buildingName =
    summary?.title && summary.title !== summary?.addr_slug
      ? summary.title
      : summary?.addr || titleize(slug);

  const chartData = useMemo(() => {
    return [...(chart || [])].reverse().map((row) => ({
      month: new Date(row.date).toLocaleDateString("en-CA", {
        month: "short",
        year: "2-digit",
      }),
      Studio: row.br1 ? Number(row.br1) : null,
      "1 Bed": row.br2 ? Number(row.br2) : null,
      "2 Bed": row.br3 ? Number(row.br3) : null,
      "3+ Bed": row.br4 ? Number(row.br4) : null,
    }));
  }, [chart]);

  const saleListings = saleData.rows.slice(saleOffset, saleOffset + PAGE);
  const leaseListings = leaseData.rows.slice(leaseOffset, leaseOffset + PAGE);

  const openGallery = (photos, idx = 0) => {
    const cleaned = (photos || []).map(fixPhoto).filter(Boolean);
    setGalleryPhotos(cleaned);
    setGalleryIdx(idx);
    setGalleryOpen(true);
  };

  if (loading && !summary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-[#F58232] border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">
            Loading building…
          </p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-6">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
          <Building2 size={40} className="mx-auto mb-4 text-slate-300" />
          <h1 className="text-2xl font-bold text-slate-900">
            Building not found
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            No data found for <b>{slug}</b>
          </p>
          <Link
            href="/top-condo-buildings-in-ontario"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#081A3A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#102752]"
          >
            <ArrowLeft size={16} /> Browse Buildings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {galleryOpen && galleryPhotos.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <button
            type="button"
            onClick={() => setGalleryOpen(false)}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={24} />
          </button>
          <button
            type="button"
            onClick={() =>
              setGalleryIdx(
                (i) => (i - 1 + galleryPhotos.length) % galleryPhotos.length,
              )
            }
            className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-5"
          >
            <ChevronLeft size={28} />
          </button>
          <img
            src={galleryPhotos[galleryIdx]}
            alt=""
            className="max-h-[88vh] max-w-[92vw] object-contain"
          />
          <button
            type="button"
            onClick={() => setGalleryIdx((i) => (i + 1) % galleryPhotos.length)}
            className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-5"
          >
            <ChevronRight size={28} />
          </button>
          <div className="absolute bottom-6 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
            {galleryIdx + 1} / {galleryPhotos.length}
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#f2f3f5] pb-28">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#06132e]">
          <div className="absolute inset-0">
            <img
              src={heroImg}
              alt=""
              className="h-full w-full scale-110 object-cover opacity-20 blur-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06132e]/95 via-[#06132e]/75 to-[#06132e]/45" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:flex lg:items-center lg:gap-12 lg:py-16">
            <div className="mb-8 flex-shrink-0 lg:mb-0 lg:w-[320px]">
              <div className="relative overflow-hidden rounded-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                <img
                  src={heroImg}
                  alt={buildingName}
                  className="h-[240px] w-full object-cover sm:h-[300px] lg:h-[360px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              </div>
            </div>

            <div className="flex-1">
              <button
                type="button"
                onClick={() => router.back()}
                className="mb-4 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
              >
                <ArrowLeft size={15} /> Back
              </button>

              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                Condo Building ·{" "}
                {String(summary.county || "ON").toUpperCase()}
              </div>

              <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                {buildingName}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-white/70">
                <MapPin size={16} className="shrink-0 text-[#F58232]" />
                <span className="text-sm">
                  {summary.addr}
                  {summary.munc_slug
                    ? `, ${titleize(summary.munc_slug)}, ON`
                    : ""}
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <StatPill
                  label="Total Active"
                  value={summary.count_total}
                  color="white"
                />
                <StatPill
                  label="For Lease"
                  value={summary.count_lease}
                  color="blue"
                />
                <StatPill
                  label="For Sale"
                  value={summary.count_sale}
                  color="orange"
                />
              </div>

              {summary.agent?.name && (
                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white/10 text-lg">
                    {summary.agent.thumbnail ? (
                      <img
                        src={
                          summary.agent.thumbnail.startsWith("http")
                            ? summary.agent.thumbnail
                            : `https://listo.ca${summary.agent.thumbnail}`
                        }
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">
                      {summary.agent.name}
                    </p>
                    <p className="text-xs text-white/50">Listing Agent</p>
                  </div>
                  <div className="flex gap-2">
                    {summary.agent.phone && (
                      <a
                        href={`tel:${summary.agent.phone}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#F58232]"
                      >
                        <Phone size={15} />
                      </a>
                    )}
                    {summary.agent.email && (
                      <a
                        href={`mailto:${summary.agent.email}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#F58232]"
                      >
                        <Mail size={15} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <div className="grid gap-5 lg:grid-cols-2">
            <StatsTable title="Properties for Lease" stats={leaseStats} s_r="Lease" />
            <StatsTable title="Properties for Sale" stats={saleStats} s_r="Sale" />
          </div>
        </section>

        {/* CHART */}
        {chartData.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
            <div className="rounded-[24px] bg-white p-5 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Price By Bedrooms
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Average sold price — last {chartData.length} months
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(BR_LABELS).map(
                    ([key, label]) =>
                      chartData.some((d) => d[label] !== null) && (
                        <span
                          key={key}
                          className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
                        >
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ background: BR_COLORS[key] }}
                          />
                          {label}
                        </span>
                      ),
                  )}
                </div>
              </div>
              <div className="mt-6 h-[260px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 8, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                      width={48}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#06132e",
                        border: "none",
                        borderRadius: 12,
                        color: "#fff",
                        fontSize: 12,
                      }}
                      formatter={(v, name) => [fmtCurrency(v), name]}
                    />
                    {Object.entries(BR_LABELS).map(([key, label]) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={label}
                        stroke={BR_COLORS[key]}
                        strokeWidth={2.5}
                        dot={false}
                        connectNulls
                        activeDot={{ r: 5 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {/* LISTINGS */}
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
          <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-4 pt-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pt-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Units at {summary.addr}
              </h2>
              <div className="flex rounded-full bg-slate-100 p-1 self-start">
                {[
                  ["lease", "Lease", leaseData.total],
                  ["sale", "Sale", saleData.total],
                ].map(([id, label, count]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                      activeTab === id
                        ? "bg-[#F58232] text-white shadow"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {label}
                    {Number(count) > 0 && (
                      <span className="ml-1.5 rounded-full bg-black/10 px-1.5 py-0.5 text-[10px]">
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === "lease" && (
                <ListingsGrid
                  listings={leaseListings}
                  allListings={leaseData.rows}
                  offset={leaseOffset}
                  setOffset={setLeaseOffset}
                  pageSize={PAGE}
                  available={leaseData.available}
                  expected={Number(summary.count_lease || 0)}
                  s_r="Lease"
                  onPhotoClick={openGallery}
                />
              )}
              {activeTab === "sale" && (
                <ListingsGrid
                  listings={saleListings}
                  allListings={saleData.rows}
                  offset={saleOffset}
                  setOffset={setSaleOffset}
                  pageSize={PAGE}
                  available={saleData.available}
                  expected={Number(summary.count_sale || 0)}
                  s_r="Sale"
                  onPhotoClick={openGallery}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function StatPill({ label, value, color }) {
  const base = "rounded-2xl border px-4 py-2.5 text-center sm:px-5 sm:py-3";
  const variants = {
    white: "border-white/20 bg-white/10 text-white backdrop-blur-sm",
    blue: "border-blue-400/30 bg-blue-500/20 text-blue-200",
    orange: "border-[#F58232]/30 bg-[#F58232]/20 text-[#F58232]",
  };
  return (
    <div className={`${base} ${variants[color]}`}>
      <p className="text-[11px] font-medium opacity-70 sm:text-xs">{label}</p>
      <p className="mt-0.5 text-xl font-black sm:text-2xl">{value ?? 0}</p>
    </div>
  );
}

function StatsTable({ title, stats, s_r }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-[20px] bg-white shadow-sm">
      <div className="bg-[#06132e] px-5 py-4 sm:px-6">
        <h3 className="text-base font-bold text-white sm:text-lg">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-sm">
          <thead>
            <tr className="bg-[#F58232]/10">
              <th className="px-4 py-3 text-left font-bold text-[#F58232] sm:px-6">
                Bedrooms
              </th>
              <th className="px-4 py-3 text-center font-bold text-[#F58232] sm:px-6">
                Listings
              </th>
              <th className="px-4 py-3 text-right font-bold text-[#F58232] sm:px-6">
                Avg Price
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row, i) => {
              const { count, label } = parseStatText(row.text);
              return (
                <tr
                  key={i}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800 sm:px-6">
                    {label}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600 sm:px-6">
                    {count}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#06132e] sm:px-6">
                    {row.num}
                    {s_r === "Lease" ? "/mo" : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ListingsGrid({
  listings,
  allListings,
  offset,
  setOffset,
  pageSize,
  available,
  expected,
  onPhotoClick,
  s_r,
}) {
  const router = useRouter();

  if (!available && allListings.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500">
        <Clock size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-medium">
          Unit inventory temporarily unavailable
        </p>
        <p className="mt-1 text-sm">
          This building shows {expected} active {s_r.toLowerCase()} units in
          summary. Bedroom averages above are still live.
        </p>
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="py-12 text-center text-slate-400">
        <Home size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-medium">
          No active {s_r.toLowerCase()} listings right now.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(allListings.length / pageSize);
  const currentPage = Math.floor(offset / pageSize);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {listings.map((item) => {
          const photo = fixPhoto(item.photos?.[0] || item.thumbnail);
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                stashListing(item);
                router.push(getListingUrl(item));
              }}
              className="group overflow-hidden rounded-[20px] border border-slate-100 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                {photo ? (
                  <img
                    src={photo}
                    alt={item.addr}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <ImageIcon size={36} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute left-3 top-3 flex gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase text-white ${
                      s_r === "Lease" ? "bg-blue-500" : "bg-[#F58232]"
                    }`}
                  >
                    {s_r}
                  </span>
                </div>
                {item.photos?.length > 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onPhotoClick(item.photos, 0);
                    }}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[10px] text-white backdrop-blur-sm"
                  >
                    <Eye size={11} /> {item.photos.length}
                  </span>
                )}
                <div className="absolute bottom-3 left-3">
                  <p className="text-lg font-black text-white">
                    {item.lp_dol_text}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <p className="line-clamp-1 font-semibold text-slate-800">
                  Unit {item.apt_num || "—"} · {item.addr?.split(",")[0]}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {item.community} · {item.municipality}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <BedDouble size={14} className="text-[#F58232]" />
                    {item.br || 0} bed
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath size={14} className="text-[#F58232]" />
                    {item.bath_tot || 0} bath
                  </span>
                  {item.sqft && (
                    <span className="flex items-center gap-1">
                      <Ruler size={14} className="text-[#F58232]" />
                      {item.sqft} sqft
                    </span>
                  )}
                  {item.maint && (
                    <span className="flex items-center gap-1">
                      <DollarSign size={14} className="text-[#F58232]" />$
                      {item.maint}/mo
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {allListings.length > pageSize && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setOffset(Math.max(0, offset - pageSize))}
            disabled={offset === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-[#F58232] hover:text-[#F58232] disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-slate-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setOffset(
                Math.min(allListings.length - pageSize, offset + pageSize),
              )
            }
            disabled={offset + pageSize >= allListings.length}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-[#F58232] hover:text-[#F58232] disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}
