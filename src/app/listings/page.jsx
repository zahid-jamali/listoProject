"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { MapPin, SlidersHorizontal, SearchX } from "lucide-react";
import ListingCards from "@/components/ListingCards";

const SALE_TYPES = {
  "homes-for-sale": { s_r: "Sale", sub_type: null, label: "Homes for Sale" },
  "homes-for-lease": { s_r: "Lease", sub_type: null, label: "Homes for Lease" },
  "houses-for-sale": { s_r: "Sale", sub_type: null, label: "Houses for Sale" },
  "houses-for-lease": { s_r: "Lease", sub_type: null, label: "Houses for Lease" },
  "condos-for-sale": { s_r: "Sale", sub_type: "CND", label: "Condos for Sale" },
  "condos-for-lease": { s_r: "Lease", sub_type: "CND", label: "Condos for Lease" },
};

const SORT_OPTIONS = [
  { value: "ld", order: "desc", label: "Newest" },
  { value: "lp_dol", order: "asc", label: "Price: Low to High" },
  { value: "lp_dol", order: "desc", label: "Price: High to Low" },
];

function titleize(slug = "") {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Legacy location urls look like `/toronto/toronto/condos-for-sale` and are
 * internally rewritten to this page. Because rewrites keep the legacy url in
 * the browser, we parse the location straight from the pathname (the rewrite's
 * injected query params are not visible to the client).
 */
function parseLocationPath(pathname = "") {
  const segs = pathname.split("/").filter(Boolean);
  if (segs.length < 2) return {};
  const saletype = segs[segs.length - 1];
  if (!SALE_TYPES[saletype]) return {};
  const [area, munc, comm] = segs.slice(0, -1);
  return { area, munc, comm, saletype };
}

/**
 * Translate the incoming url (legacy location path, or an explicit
 * `?loc_type=&search_text=` search) into the upstream `/api/listings` query.
 */
function buildQuery(sp, pathname) {
  const params = new URLSearchParams();

  const fromPath = parseLocationPath(pathname);
  const area = sp.get("area") || sp.get("area_slug") || fromPath.area;
  const munc = sp.get("munc") || sp.get("munc_slug") || fromPath.munc;
  const comm = sp.get("comm") || sp.get("comm_slug") || fromPath.comm;
  const saletype = sp.get("saletype") || fromPath.saletype;

  // Explicit params take priority (already-canonical search links)
  let loc_type = sp.get("loc_type");
  let search_text = sp.get("search_text");
  let sub_type = sp.get("sub_type");
  let s_r = sp.get("s_r");
  const type = sp.get("type") || "RS";

  // Derive from a legacy location path (area/munc/comm + sale-type)
  if (!loc_type && (area || munc || comm)) {
    if (comm) {
      loc_type = "COMM";
      search_text = comm;
    } else if (munc) {
      loc_type = "MUNC";
      search_text = munc;
    } else {
      // Common city names passed via area_slug that are municipalities in TRREB
      const MUNC_ONLY = new Set([
        "vaughan",
        "brampton",
        "markham",
        "stouffville",
        "whitchurch-stouffville",
        "ajax",
        "mississauga",
        "oakville",
        "richmond-hill",
        "pickering",
        "oshawa",
        "whitby",
        "burlington",
        "milton",
      ]);
      const slugLower = String(area).toLowerCase();
      loc_type = MUNC_ONLY.has(slugLower) ? "MUNC" : "AREA";
      search_text = slugLower === "stouffville" ? "whitchurch-stouffville" : area;
    }
  }

  let label = "";
  if (saletype && SALE_TYPES[saletype]) {
    const cfg = SALE_TYPES[saletype];
    if (!s_r) s_r = cfg.s_r;
    if (!sub_type && cfg.sub_type) sub_type = cfg.sub_type;
    label = cfg.label;
  }

  params.set("type", type);
  if (loc_type) params.set("loc_type", loc_type);
  if (search_text) params.set("search_text", search_text);
  if (s_r) params.set("s_r", s_r);
  if (sub_type) params.set("sub_type", sub_type);

  // Passthrough filters
  ["pr_min", "pr_max", "br_min", "bath_min", "sub_type2"].forEach((k) => {
    const v = sp.get(k);
    if (v) params.set(k, v);
  });

  const locationName = search_text ? titleize(search_text) : "";
  const heading = [locationName, label].filter(Boolean).join(" · ") || "Real Estate Listings";

  return { params, heading, locationName };
}

function ListingsResults() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(24);
  const [sortIdx, setSortIdx] = useState(0);

  const spKey = `${pathname}?${sp.toString()}`;

  const { params: baseParams, heading, locationName } = useMemo(
    () => buildQuery(sp, pathname),
    [spKey],
  );

  const [srFilter, setSrFilter] = useState(() => baseParams.get("s_r") || "");
  const [subTypeFilter, setSubTypeFilter] = useState(
    () => baseParams.get("sub_type") || "",
  );
  const [bedsFilter, setBedsFilter] = useState(
    () => baseParams.get("br_min") || "",
  );
  const [maxPriceFilter, setMaxPriceFilter] = useState(
    () => baseParams.get("pr_max") || "",
  );

  useEffect(() => {
    setSrFilter(baseParams.get("s_r") || "");
    setSubTypeFilter(baseParams.get("sub_type") || "");
    setBedsFilter(baseParams.get("br_min") || "");
    setMaxPriceFilter(baseParams.get("pr_max") || "");
    setLimit(24);
  }, [spKey, baseParams]);

  useEffect(() => {
    let cancelled = false;

    const fetchListings = async () => {
      try {
        setLoading(true);
        const q = new URLSearchParams(baseParams);
        if (srFilter) q.set("s_r", srFilter);
        else q.delete("s_r");

        if (subTypeFilter) q.set("sub_type", subTypeFilter);
        else q.delete("sub_type");

        if (bedsFilter) q.set("br_min", bedsFilter);
        else q.delete("br_min");

        if (maxPriceFilter) q.set("pr_max", maxPriceFilter);
        else q.delete("pr_max");

        const sort = SORT_OPTIONS[sortIdx];
        q.set("sort", sort.value);
        q.set("order", sort.order);
        q.set("limit", String(limit));
        q.set("incl_total", "1");

        const res = await fetch(`/api/listings?${q.toString()}`);
        const data = await res.json();

        if (cancelled) return;
        setRows(data?.rows || []);
        setTotal(Number(data?.total || data?.count || 0));
      } catch (err) {
        if (!cancelled) {
          setRows([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchListings();
    return () => {
      cancelled = true;
    };
  }, [baseParams, srFilter, subTypeFilter, bedsFilter, maxPriceFilter, sortIdx, limit]);

  return (
    <div className="mx-auto max-w-[1450px] px-4 pb-16 pt-28 lg:px-8 lg:pt-32">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black tracking-[-0.02em] text-[#0B132B] lg:text-3xl">
            {locationName && <MapPin className="h-6 w-6 text-[#F36B22]" />}
            {heading}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Searching listings…"
              : `${total.toLocaleString()} ${
                  total === 1 ? "listing" : "listings"
                } found`}
          </p>
        </div>

        {/* FILTERS & SORT */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={srFilter}
            onChange={(e) => {
              setSrFilter(e.target.value);
              setLimit(24);
            }}
            className="w-[calc(50%-4px)] sm:w-auto flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-[#F36B22]"
          >
            <option value="">Buy & Lease</option>
            <option value="Sale">For Sale</option>
            <option value="Lease">For Lease</option>
          </select>

          <select
            value={subTypeFilter}
            onChange={(e) => {
              setSubTypeFilter(e.target.value);
              setLimit(24);
            }}
            className="w-[calc(50%-4px)] sm:w-auto flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-[#F36B22]"
          >
            <option value="">All Property Types</option>
            <option value="FREE">Houses / Freehold</option>
            <option value="CND">Condos</option>
          </select>

          <select
            value={bedsFilter}
            onChange={(e) => {
              setBedsFilter(e.target.value);
              setLimit(24);
            }}
            className="w-[calc(50%-4px)] sm:w-auto flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-[#F36B22]"
          >
            <option value="">Any Beds</option>
            <option value="1">1+ Beds</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
          </select>

          <select
            value={maxPriceFilter}
            onChange={(e) => {
              setMaxPriceFilter(e.target.value);
              setLimit(24);
            }}
            className="w-[calc(50%-4px)] sm:w-auto flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-[#F36B22]"
          >
            <option value="">Max Price: Any</option>
            <option value="600000">Up to $600K</option>
            <option value="800000">Up to $800K</option>
            <option value="1000000">Up to $1M</option>
            <option value="1500000">Up to $1.5M</option>
            <option value="2500000">Up to $2.5M</option>
          </select>

          <div className="flex w-full sm:w-auto items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" />
            <select
              value={sortIdx}
              onChange={(e) => setSortIdx(Number(e.target.value))}
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-[#F36B22]"
            >
              {SORT_OPTIONS.map((o, i) => (
                <option key={o.label} value={i}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* GRID */}
      {loading && rows.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[360px] animate-pulse rounded-[24px] bg-slate-200"
            />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-white py-20 text-center">
          <SearchX className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-bold text-slate-800">
            No listings found
          </p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Try a different location or adjust your filters to see more results.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {rows.map((listing, idx) => (
              <ListingCards
                key={`${listing.id || idx}-${listing.brd || ""}`}
                listing={listing}
              />
            ))}
          </div>

          {rows.length < total && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setLimit((l) => l + 24)}
                disabled={loading}
                className="rounded-full bg-[#F36B22] px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#d95c1a] disabled:opacity-60"
              >
                {loading ? "Loading…" : "Load more listings"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Suspense
        fallback={
          <div className="mx-auto max-w-[1450px] px-4 py-10 lg:px-8">
            <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" />
          </div>
        }
      >
        <ListingsResults />
      </Suspense>
    </div>
  );
}
