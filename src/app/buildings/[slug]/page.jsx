// app/buildings/[slug]/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BedDouble, Bath, Phone, Mail } from "lucide-react";

export default function BuildingPage() {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(null);
  const [stats, setStats] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [chart, setChart] = useState([]);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        setLoading(true);

        const buildingRes = await fetch(
          `/api/building?addr_slug=${slug}&s_r=Lease&limit=12`
        );
        const buildingData = await buildingRes.json();

        const summary = buildingData?.summary;

        const [statsRes, chartRes, monthlyRes] = await Promise.all([
          fetch(`/api/building/stats?addr_slug=${slug}&s_r=Lease`),
          fetch(`/api/building/sold-chart?addr_slug=${slug}&s_r=Sale`),
          fetch(
            `/api/building/sold-monthly?addr=${encodeURIComponent(
              summary?.addr || ""
            )}&s_r=Sale`
          ),
        ]);

        setBuilding(buildingData);
        setStats(await statsRes.json());
        setChart(await chartRes.json());
        setMonthly(await monthlyRes.json());
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  const getImageUrl = (url) => {
    if (!url) return "/assets/buildings.png";

    const trrebIndex = url.indexOf("https://trreb-image");

    if (trrebIndex !== -1) {
      return url.substring(trrebIndex);
    }

    return url;
  };

  const chartData = useMemo(
    () =>
      (chart || []).map((item) => ({
        month: new Date(item.date).toLocaleDateString("en-CA", {
          month: "short",
          year: "2-digit",
        }),
        price: Number(item.br1 || item.br2 || item.br3 || item.br4 || 0),
      })),
    [chart]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const summary = building?.summary;
  const listings = building?.rows || [];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-[#081A3A]">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={listings?.[0]?.photos?.[0] || listings?.[0]?.thumbnail}
            alt=""
            className="h-full w-full object-cover blur-3xl scale-125 opacity-30"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#081A3A]/40 via-[#081A3A]/60 to-[#081A3A]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[520px_1fr] lg:items-center">
            {/* Actual Image */}
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <img
                src={listings?.[0]?.photos?.[0] || listings?.[0]?.thumbnail}
                alt={summary?.addr}
                className="w-full object-contain bg-[#0F172A]"
              />
            </div>

            {/* Content */}
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl">
                Premium Condo Building
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight text-white lg:text-6xl">
                {summary?.addr}
              </h1>

              <p className="mt-4 text-lg text-white/75">
                {summary?.munc_slug?.replace(/-/g, " ")} •{" "}
                {summary?.county?.toUpperCase()}
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-wider text-white/60">
                    Total
                  </p>
                  <h3 className="mt-2 text-3xl font-black text-white">
                    {summary?.count_total}
                  </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-wider text-white/60">
                    Lease
                  </p>
                  <h3 className="mt-2 text-3xl font-black text-white">
                    {summary?.count_lease}
                  </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-wider text-white/60">
                    Sale
                  </p>
                  <h3 className="mt-2 text-3xl font-black text-white">
                    {summary?.count_sale}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-4">
          <Card title="Total Listings" value={summary?.count_total} />
          <Card title="For Lease" value={summary?.count_lease} />
          <Card title="For Sale" value={summary?.count_sale} />
          <Card title="Units Found" value={building?.total} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Sold Price Trend</h2>

            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Agent</h2>

            <div className="mt-6 flex items-center gap-4">
              <img
                src={`https://listo.ca/${summary?.agent?.thumbnail}`}
                className="h-16 w-16 rounded-full"
                alt="agent"
              />
              <div>
                <h3 className="font-bold">{summary?.agent?.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Phone size={14} />
                  {summary?.agent?.phone}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Mail size={14} />
                  {summary?.agent?.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold">Available Listings</h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((item) => (
              <a key={item.id} className="overflow-hidden rounded-3xl border">
                <img
                  src={getImageUrl(item.thumbnail)}
                  alt={item.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="line-clamp-2 font-bold">{item.title}</h3>

                  <p className="mt-3 text-2xl font-black text-orange-600">
                    {item.lp_dol_text}
                  </p>

                  <div className="mt-4 flex gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <BedDouble size={16} />
                      {item.br}
                    </span>

                    <span className="flex items-center gap-1">
                      <Bath size={16} />
                      {item.bath_tot}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-500">{item.sqft}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold">Building Statistics</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {(stats || []).map((s, i) => (
              <div key={i} className="rounded-2xl border p-5">
                <div
                  className="text-3xl font-black"
                  dangerouslySetInnerHTML={{ __html: s.num }}
                />
                <div
                  className="mt-2 text-sm text-slate-500"
                  dangerouslySetInnerHTML={{ __html: s.text }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-3xl font-black">{value || 0}</h3>
    </div>
  );
}
