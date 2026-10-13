"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Home,
  Building2,
  MapPin,
  Waves,
  DoorOpen,
  CalendarDays,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BarChart3,
  Activity,
  DollarSign,
  Layers,
} from "lucide-react";
import { parseStatsSlug, titleize } from "@/lib/stats-location";

/* ── helpers ─────────────────────────────────────────── */
function fmtPrice(v) {
  const n = Number(String(v || "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(n) || n === 0) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtFull(v) {
  const n = Number(String(v || "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(n) || n === 0) return "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtNum(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString();
}

function pctChange(curr, prev) {
  const a = Number(curr);
  const b = Number(prev);
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
  return Number((((a - b) / b) * 100).toFixed(1));
}

function ChangePill({ value }) {
  if (value === null || value === undefined || Number.isNaN(Number(value)))
    return null;
  const n = Number(value);
  const positive = n > 0;
  const neutral = n === 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
        neutral
          ? "bg-white/10 text-white/70"
          : positive
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-red-500/15 text-red-400"
      }`}
    >
      {positive ? (
        <ArrowUpRight size={11} />
      ) : neutral ? (
        <Minus size={11} />
      ) : (
        <ArrowDownRight size={11} />
      )}
      {positive ? "+" : ""}
      {n}%
    </span>
  );
}

const PIE_COLORS = ["#F58232", "#06132e", "#3B82F6", "#10B981", "#8B5CF6"];

/* ── Market Pulse Gauge ───────────────────────────────── */
function MarketGauge({ score, label, title }) {
  const pct = Math.min(100, Math.max(0, Number(score) || 0));
  const angle = -90 + (pct / 100) * 180;
  const color = pct < 33 ? "#ef4444" : pct < 66 ? "#F58232" : "#22c55e";

  return (
    <div className="flex flex-col items-center px-2">
      <div className="relative h-[120px] w-[240px]">
        <svg viewBox="0 0 240 120" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#F58232" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path
            d="M24,112 A96,96 0 0,1 216,112"
            fill="none"
            stroke="#e8ecf1"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M24,112 A96,96 0 0,1 216,112"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 301} 301`}
          />
          <line
            x1="120"
            y1="112"
            x2={120 + 78 * Math.cos(((angle - 90) * Math.PI) / 180)}
            y2={112 + 78 * Math.sin(((angle - 90) * Math.PI) / 180)}
            stroke="#06132e"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="120" cy="112" r="7" fill="#06132e" />
        </svg>
      </div>
      <p className="mt-1 text-2xl font-black text-[#06132e]">
        {label || "—"}
      </p>
      <p className="mt-1 max-w-[220px] text-center text-xs leading-5 text-slate-500">
        {title || `Market score ${pct}`}
      </p>
      <div className="mt-4 flex w-full max-w-[240px] justify-between text-[11px] font-semibold">
        <span className="text-red-500">Buyers</span>
        <span className="text-slate-400">Balanced</span>
        <span className="text-emerald-600">Sellers</span>
      </div>
    </div>
  );
}

function Sparkline({ data, color = "#F58232" }) {
  if (!data?.length) return null;
  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`sp-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#sp-${color})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────── */
export default function StatsDetailPage() {
  const { slug } = useParams();
  const locMeta = useMemo(() => parseStatsSlug(slug), [slug]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [subType, setSubType] = useState("ResidentialProperty");
  const [activityMode, setActivityMode] = useState("sale"); // sale | lease
  const [soldMode, setSoldMode] = useState("avg"); // avg | median

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/stats/overview?slug=${encodeURIComponent(slug)}&sub_type=${subType}`,
        );
        const json = await res.json();
        if (!cancelled) setData(json?.success ? json : null);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, subType]);

  const label = data?.location?.label || locMeta.label;

  /* Derived charts / metrics */
  const pulseRows = data?.pulse?.market_pulse_data || [];
  const soldRows = data?.sold?.sale || [];
  const listingSale = data?.listingSummary?.sale || [];
  const listingLease = data?.listingSummary?.lease || [];
  const homeTypes = data?.homeTypes || [];
  const counts = data?.counts || {};

  const latestSold = soldRows[0] || {};
  const prevSold = soldRows[1] || {};
  const latestListing = listingSale[0] || {};
  const prevListing = listingSale[1] || {};
  const latestLeaseListing = listingLease[0] || {};

  const soldDelta = pctChange(latestSold.avg_sold_price, prevSold.avg_sold_price);
  const listDelta = pctChange(latestListing.num_listed, prevListing.num_listed);
  const priceListDelta = pctChange(
    latestListing.avg_list_price,
    prevListing?.avg_list_price,
  );
  const domDelta = pctChange(
    pulseRows[0]?.avg_sold_in_days || data?.pulse?.avg_sold_in_days,
    pulseRows[1]?.avg_sold_in_days,
  );

  const pulseChart = useMemo(
    () =>
      [...pulseRows].reverse().map((d) => ({
        month: String(d.Month || "").replace(/ 20/, " '"),
        Listed: Number(d.new_listings) || 0,
        Sold: Number(d.sold_listings) || 0,
      })),
    [pulseRows],
  );

  const soldChart = useMemo(
    () =>
      [...soldRows].reverse().map((d) => ({
        month: String(d.Month || "").replace(/ 20/, " '"),
        price: Number(d.avg_sold_price) || 0,
        sold: Number(d.num_sold) || 0,
      })),
    [soldRows],
  );

  const sparkPrice = useMemo(
    () => soldChart.map((d) => ({ v: d.price })),
    [soldChart],
  );
  const sparkListings = useMemo(
    () =>
      [...listingSale]
        .reverse()
        .slice(-6)
        .map((d) => ({ v: Number(d.num_listed) || 0 })),
    [listingSale],
  );
  const sparkDom = useMemo(
    () =>
      [...pulseRows]
        .reverse()
        .map((d) => ({
          v: Number(d.avg_sold_in_days || data?.pulse?.avg_sold_in_days) || 0,
        })),
    [pulseRows, data],
  );

  const pieData = useMemo(() => {
    const homes = Number(counts.homes || 0);
    const condos = Number(counts.condos || 0);
    if (homes + condos > 0) {
      return [
        { name: "Freehold Homes", value: homes },
        { name: "Condos", value: condos },
      ].filter((x) => x.value > 0);
    }
    // Fallback: relative from home-type YoY presence
    return homeTypes
      .filter((t) => t.sub_type2 && !String(t.sub_type2).startsWith("All"))
      .slice(0, 5)
      .map((t) => ({
        name: t.sub_type2,
        value: Math.max(1, Math.abs(Number(t.one_yr_change_prcnt) || 1) * 10),
      }));
  }, [counts, homeTypes]);

  const pieTotal = pieData.reduce((s, d) => s + d.value, 0);

  const perfBars = useMemo(() => {
    const rows = homeTypes.filter(
      (t) => t.sub_type2 && !String(t.sub_type2).startsWith("All"),
    );
    const max = Math.max(
      ...rows.map((r) => Number(r.current_val) || 0),
      1,
    );
    return rows.map((r) => ({
      name: r.sub_type2,
      value: Number(r.current_val) || 0,
      yoy: Number(r.one_yr_change_prcnt),
      six: Number(r.six_month_change_prcnt),
      pct: ((Number(r.current_val) || 0) / max) * 100,
    }));
  }, [homeTypes]);

  const specialty = [
    {
      icon: Waves,
      label: "Pool",
      count: latestListing.amen_pool,
      href: `/${locMeta.area_slug || "toronto"}/homes-for-sale`,
    },
    {
      icon: DoorOpen,
      label: "Basement",
      count: latestListing.amen_bsmt_sep_entrance,
      href: `/${locMeta.area_slug || "toronto"}/homes-for-sale`,
    },
    {
      icon: CalendarDays,
      label: "Open House",
      count: null,
      href: `/real-estate-listings?area_slug=${encodeURIComponent(locMeta.area_slug || "toronto")}&s_r=Sale`,
    },
    {
      icon: Zap,
      label: "Price Changes",
      count:
        Number(latestListing.num_price_inc || 0) +
        Number(latestListing.num_price_dec || 0),
      href: `/real-estate-listings?area_slug=${encodeURIComponent(locMeta.area_slug || "toronto")}&s_r=Sale`,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f4f5f7] pt-24 lg:pt-28">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#F58232] border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">
            Loading stats for {label}…
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f4f5f7] px-6 pt-24 lg:pt-28">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
          <BarChart3 className="mx-auto mb-4 text-slate-300" size={40} />
          <h1 className="text-2xl font-bold text-slate-900">Stats unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">
            We couldn&apos;t load market data for {label}.
          </p>
          <Link
            href="/real-estate-market-stats"
            className="mt-6 inline-flex rounded-full bg-[#06132e] px-6 py-3 text-sm font-semibold text-white"
          >
            Browse markets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] pb-28 pt-24 lg:pt-28">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Market intelligence
            </p>
            <h1 className="mt-1 flex flex-wrap items-center gap-2 text-3xl font-black tracking-tight text-[#06132e] sm:text-4xl">
              Stats for{" "}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#06132e] px-4 py-1.5 text-lg text-white sm:text-xl">
                <MapPin size={16} className="text-[#F58232]" />
                {label}
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "ResidentialProperty", label: "Homes" },
              { key: "CondoProperty", label: "Condos" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setSubType(t.key)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                  subType === t.key
                    ? "bg-[#F58232] text-white shadow"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#F58232]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE LISTINGS + HOME TYPES */}
        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-bold text-[#06132e]">Active Listings</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
              <Metric
                label="For Sale"
                value={fmtNum(counts.forSale)}
                icon={Home}
              />
              <Metric
                label="Median Sale Price"
                value={fmtPrice(latestSold.avg_sold_price)}
                icon={DollarSign}
                accent
              />
              <Metric
                label="For Lease"
                value={fmtNum(counts.forLease)}
                icon={Building2}
              />
              <Metric
                label="Avg List Price"
                value={fmtPrice(latestListing.avg_list_price)}
                icon={Activity}
              />
              <Metric
                label="Pre-Construction"
                value={fmtNum(counts.preConstruction)}
                icon={Layers}
              />
              <Metric
                label="New Listings"
                value={fmtNum(latestListing.num_listed || pulseRows[0]?.new_listings)}
                icon={TrendingUp}
                accent
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-bold text-[#06132e]">Home Types</h2>
            <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative h-[200px] w-full max-w-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={84}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {pieData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, n) => [fmtNum(v), n]}
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-black text-[#06132e]">
                    {fmtNum(pieTotal || counts.forSale)}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Active
                  </p>
                </div>
              </div>
              <ul className="w-full space-y-2.5">
                {pieData.map((d, i) => (
                  <li
                    key={d.name}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          background: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      {d.name}
                    </span>
                    <span className="font-bold text-[#06132e]">
                      {fmtNum(d.value)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* MARKET PULSE */}
        <section className="mt-5 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#06132e]">Market Pulse</h2>
            <p className="text-xs text-slate-400">
              New listings vs sold · last {pulseChart.length} months
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="h-[260px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pulseChart}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
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
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#06132e",
                      border: "none",
                      borderRadius: 12,
                      color: "#fff",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Listed"
                    stroke="#06132e"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Sold"
                    stroke="#F58232"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <MarketGauge
              score={data.pulse?.market_pulse_score}
              label={data.pulse?.market_pulse_label}
              title={
                data.pulse?.market_pulse_title ||
                `${label} is currently a ${data.pulse?.market_pulse_label || "balanced"} market.`
              }
            />
          </div>
        </section>

        {/* RECENT ACTIVITY (dark) */}
        <section className="mt-5 overflow-hidden rounded-[28px] bg-[#06132e] p-5 text-white sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Recent Activity</h2>
            <div className="flex rounded-full bg-white/10 p-1">
              {[
                ["sale", "Sale"],
                ["lease", "Lease"],
              ].map(([id, text]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActivityMode(id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    activityMode === id
                      ? "bg-[#F58232] text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ActivityCard
              label="Avg. Sold Price"
              value={fmtPrice(latestSold.avg_sold_price)}
              change={soldDelta}
              spark={sparkPrice}
              color="#F58232"
            />
            <ActivityCard
              label="New Listings"
              value={fmtNum(
                activityMode === "sale"
                  ? latestListing.num_listed
                  : latestLeaseListing.num_listed,
              )}
              change={listDelta}
              spark={sparkListings}
              color="#60a5fa"
            />
            <ActivityCard
              label="Avg. DOM"
              value={fmtNum(
                data.pulse?.avg_sold_in_days ||
                  pulseRows[0]?.avg_sold_in_days ||
                  latestSold.avg_sold_in_days,
              )}
              change={domDelta}
              spark={sparkDom}
              color="#34d399"
            />
          </div>
        </section>

        {/* SPECIALTY FILTERS */}
        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {specialty.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group rounded-[22px] bg-[#06132e] p-5 text-center transition hover:-translate-y-0.5 hover:bg-[#0a1d42]"
            >
              <s.icon
                className="mx-auto text-[#F58232] transition group-hover:scale-110"
                size={28}
              />
              <p className="mt-3 text-sm font-bold text-white">{s.label}</p>
              {s.count != null && (
                <p className="mt-1 text-xs text-white/50">
                  {fmtNum(s.count)} this month
                </p>
              )}
            </Link>
          ))}
        </section>

        {/* SOLD INSIGHTS */}
        <section className="mt-5 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#06132e]">Sold Insights</h2>
              <p className="text-xs text-slate-400">
                Average sold price trend in {label}
              </p>
            </div>
            <div className="flex rounded-full bg-slate-100 p-1">
              {[
                ["avg", "Average"],
                ["sold", "Sold volume"],
              ].map(([id, text]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSoldMode(id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    soldMode === id
                      ? "bg-[#06132e] text-white"
                      : "text-slate-500"
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[280px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={soldChart}>
                <defs>
                  <linearGradient id="soldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06132e" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#06132e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
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
                  tickFormatter={(v) =>
                    soldMode === "avg" ? `$${(v / 1000).toFixed(0)}k` : v
                  }
                />
                <Tooltip
                  formatter={(v) =>
                    soldMode === "avg" ? fmtFull(v) : fmtNum(v)
                  }
                  contentStyle={{
                    background: "#06132e",
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={soldMode === "avg" ? "price" : "sold"}
                  stroke="#06132e"
                  strokeWidth={2.5}
                  fill="url(#soldFill)"
                  dot={{ r: 4, fill: "#06132e", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#F58232" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Latest month sold
              </p>
              <p className="mt-1 text-xl font-black text-[#06132e]">
                {fmtNum(latestSold.num_sold)} · {fmtFull(latestSold.avg_sold_price)}
              </p>
            </div>
            {soldDelta !== null && (
              <div className="rounded-2xl bg-[#FFF7ED] px-4 py-3 text-right">
                <p className="text-xs font-semibold text-slate-500">MoM change</p>
                <p
                  className={`text-lg font-black ${
                    soldDelta >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {soldDelta >= 0 ? "+" : ""}
                  {soldDelta}%
                </p>
              </div>
            )}
          </div>
        </section>

        {/* PRICE PERFORMANCE BY HOME TYPE */}
        <section className="mt-5 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-bold text-[#06132e]">
            Price Performance by Home Type
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Current median / YoY change in {label}
          </p>

          <div className="mt-6 space-y-5">
            {perfBars.length === 0 && (
              <p className="text-sm text-slate-400">No home-type data available.</p>
            )}
            {perfBars.map((row) => (
              <div key={row.name}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-700">
                    {row.name}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-bold text-[#06132e]">
                    {row.value ? fmtPrice(row.value) : "—"}
                    {Number.isFinite(row.yoy) && (
                      <span
                        className={`text-xs ${
                          row.yoy >= 0 ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {row.yoy >= 0 ? "+" : ""}
                        {row.yoy}% YoY
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#06132e] to-[#F58232]"
                    style={{
                      width: `${Math.max(row.pct || Math.abs(row.yoy || 0) * 4, 6)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* QUICK LINKS */}
        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: `Recent Solds in ${label}`,
              href: `/${locMeta.area_slug || "toronto"}/homes-for-sale`,
              icon: TrendingDown,
            },
            {
              label: `Price changes in ${label}`,
              href: `/real-estate-listings?area_slug=${encodeURIComponent(locMeta.area_slug || "toronto")}&s_r=Sale`,
              icon: Activity,
            },
            {
              label: `Investment listings`,
              href: `/investment-properties-in-${locMeta.munc_slug || "toronto"}`,
              icon: DollarSign,
            },
            {
              label: `Pre-construction`,
              href: `/pre-construction/${locMeta.area_slug || "toronto"}`,
              icon: Building2,
            },
          ].map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-[22px] bg-[#06132e] p-5 transition hover:-translate-y-0.5 hover:bg-[#0a1d42]"
            >
              <card.icon
                size={28}
                className="text-[#F58232] transition group-hover:scale-110"
              />
              <p className="mt-4 text-sm font-bold leading-5 text-white">
                {card.label}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, icon: Icon, accent }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent
          ? "border-[#F58232]/25 bg-[#FFF7ED]"
          : "border-slate-100 bg-slate-50/80"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        {Icon && (
          <Icon
            size={14}
            className={accent ? "text-[#F58232]" : "text-slate-400"}
          />
        )}
      </div>
      <p
        className={`mt-2 text-xl font-black sm:text-2xl ${
          accent ? "text-[#F58232]" : "text-[#06132e]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ActivityCard({ label, value, change, spark, color }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-white">{value ?? "—"}</p>
        </div>
        <ChangePill value={change} />
      </div>
      <div className="mt-4">
        <Sparkline data={spark} color={color} />
      </div>
    </div>
  );
}
