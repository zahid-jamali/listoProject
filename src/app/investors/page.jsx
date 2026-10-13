"use client";

import { motion } from "framer-motion";
import { ChevronDown, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function titleize(slug = "") {
  return String(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export default function InvestorListings() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/picklist_inv_listings");
        const data = await res.json();

        const rows = Array.isArray(data) ? data : data?.rows || [];
        const cleaned = rows
          .filter((r) => r?.munc_slug)
          .map((r) => ({
            slug: r.munc_slug,
            name: titleize(r.munc_slug),
            count: Number(r.count || 0),
          }));

        if (!cancelled) {
          setLocations(cleaned);
          setSelected(cleaned[0]?.slug || "");
        }
      } catch {
        if (!cancelled) setLocations([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCity = useMemo(
    () => locations.find((c) => c.slug === selected) || null,
    [locations, selected],
  );

  const totalListings = useMemo(
    () => locations.reduce((sum, c) => sum + c.count, 0),
    [locations],
  );

  const go = () => {
    if (selectedCity?.slug) {
      router.push(`/investment-properties-in-${selectedCity.slug}`);
    }
  };

  return (
    <section className="bg-[#F7F8FA] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-4 py-2 text-sm font-medium text-[#F97316]">
            Investors & Developers
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            Listings For Investors & Developers
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#6B7280] sm:text-base">
            Discover high-potential opportunities using LISTO&apos;s proprietary
            market intelligence. Compare listings against historical sales,
            lot-size benchmarks and investment metrics.
          </p>

          {!loading && locations.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#111827] shadow-sm">
                <TrendingUp size={15} className="text-[#F97316]" />
                {totalListings.toLocaleString()} investment listings
              </span>
              <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#111827] shadow-sm">
                {locations.length.toLocaleString()} markets
              </span>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-8 max-w-3xl rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.05)] lg:p-10"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#111827] lg:text-3xl">
              View Investment Listings
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6B7280]">
              Select a market and instantly discover curated opportunities for
              investors, developers and land acquisition strategies.
            </p>
          </div>

          <div className="mt-8">
            <label className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Browse Markets
            </label>

            <div className="group relative">
              <select
                value={selected}
                disabled={loading || locations.length === 0}
                onChange={(e) => setSelected(e.target.value)}
                className="h-[64px] w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-5 pr-14 text-[15px] font-semibold text-slate-900 shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-orange-300 hover:shadow-[0_12px_35px_rgba(249,115,22,0.12)] focus:border-[#F97316] focus:outline-none focus:ring-4 focus:ring-orange-100 disabled:opacity-60"
              >
                {loading ? (
                  <option>Loading markets…</option>
                ) : locations.length === 0 ? (
                  <option>No markets available</option>
                ) : (
                  locations.map((city) => (
                    <option key={city.slug} value={city.slug}>
                      {city.name} • {city.count.toLocaleString()} Listings
                    </option>
                  ))
                )}
              </select>

              <div className="pointer-events-none absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-orange-50 text-[#F97316] transition-all duration-300 group-hover:bg-orange-100">
                <ChevronDown size={18} />
              </div>
            </div>

            {selectedCity && (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Explore opportunities in{" "}
                  <span className="font-semibold text-slate-900">
                    {selectedCity.name}
                  </span>
                </p>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#F97316]">
                  {selectedCity.count.toLocaleString()} Listings
                </span>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <motion.button
              onClick={go}
              disabled={!selectedCity}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-2xl bg-[#081A3A] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#102752] disabled:cursor-not-allowed disabled:opacity-50"
            >
              View Opportunities
              <ArrowRight size={16} />
            </motion.button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] px-4 py-3">
            <Sparkles size={14} className="text-[#F97316]" />
            <p className="text-sm font-medium text-[#F97316]">
              Compare listings against minimum and maximum sold prices by lot
              size.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
