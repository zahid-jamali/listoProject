"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Images, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/modals/LoginModal";
import SignupModal from "@/components/modals/SingupModal";

function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatHistoryDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  // Match legacy: toDateString().split(' ').slice(1).join(' ') → "Jan 15 2024"
  return d.toDateString().split(" ").slice(1).join(" ");
}

function buildHistoryQuery(property = {}) {
  const params = new URLSearchParams();
  params.set("addr_type", "single");
  params.set("redirect_type", "modal");

  if (property.id) params.set("id", String(property.id));
  if (property.brd) params.set("brd", String(property.brd));
  if (property.sub_type) params.set("sub_type", String(property.sub_type));
  if (property.st_num) params.set("st_num", String(property.st_num));
  if (property.apt_num) params.set("apt_num", String(property.apt_num));
  if (property.st) params.set("st", String(property.st));
  if (property.zip) params.set("zip", String(property.zip));
  if (property.addr_slug) params.set("addr_slug", String(property.addr_slug));

  return params;
}

const PLACEHOLDER_ROWS = [
  {
    date: "Mar 12 2024",
    listed: "$1,249,000",
    sold: "$1,215,000",
    note: "Sold after 18 days on market.",
    soldDeal: true,
  },
  {
    date: "Sep 04 2021",
    listed: "$1,099,000",
    sold: null,
    note: "Listing expired / terminated.",
    soldDeal: false,
  },
  {
    date: "Jun 18 2018",
    listed: "$899,000",
    sold: "$875,000",
    note: "Sold after 42 days on market.",
    soldDeal: true,
  },
];

function HistoryRow({
  date,
  title,
  note,
  noteTone = "neutral",
  viewHref = null,
  compareHref = null,
  isArchive = false,
}) {
  const noteClass =
    noteTone === "success"
      ? "text-emerald-700"
      : noteTone === "danger"
        ? "text-rose-600"
        : "text-slate-500";

  return (
    <li className="relative border-b border-slate-100 py-4 last:border-b-0 pl-4 sm:pl-5">
      <span className="absolute left-0 top-5 h-2 w-2 -translate-x-[5px] rounded-full bg-[#F36B22] ring-4 ring-orange-50" />
      {date && (
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {date}
        </p>
      )}
      <h3 className="mt-1 text-base font-bold text-[#0B132B] sm:text-lg">
        {title}
      </h3>
      {note && <p className={`mt-1 text-sm ${noteClass}`}>{note}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {isArchive ? (
          <span className="text-sm text-slate-500">
            Please ask for detailed history
          </span>
        ) : viewHref ? (
          <Link
            href={viewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            View
            <ExternalLink size={12} />
          </Link>
        ) : null}
        {compareHref && (
          <Link
            href={compareHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Compare Photos
            <Images size={12} />
          </Link>
        )}
      </div>
    </li>
  );
}

function mapHistoryItem(item, listingId, addrType) {
  const lp = formatMoney(item?.lp_dol);
  const sp = formatMoney(item?.sp_dol);
  const prefix =
    addrType === "building" && item?.apt_num
      ? `Apt# ${item.apt_num} - `
      : "";

  let title;
  let noteTone = "neutral";
  if (sp) {
    title = (
      <>
        {prefix}
        {lp ? <s className="text-slate-400">{lp}</s> : null}
        {lp ? <span className="mx-2">&nbsp;</span> : null}
        <span>{sp}</span>
      </>
    );
    noteTone = "success";
  } else {
    title = `${prefix}Was Listed for ${item?.s_r || "Sale"}: ${lp || "—"}`;
    noteTone = "danger";
  }

  const accessUrl = item?.access_url || "";
  const isArchive = String(accessUrl).includes("archive");
  const historyNote = item?.listing_history
    ? `${item.listing_history}.`
    : null;

  return {
    key: `${item?.id || "row"}-${item?.unavail_dt || item?.ld || ""}`,
    date: formatHistoryDate(item?.unavail_dt),
    title,
    note: historyNote,
    noteTone,
    viewHref: !isArchive && accessUrl ? accessUrl : null,
    compareHref:
      listingId && item?.id
        ? `/compare-real-estate-listings-pictures/${listingId},${item.id}`
        : null,
    isArchive,
  };
}

/**
 * Sale/Lease History — mirrors legacy single_listing historyButton + get_addr_hist.
 * Logged out: blurred placeholder + "Login to view" CTA.
 * Logged in: fetches real history with the same query params as legacy.
 */
export default function SaleLeaseHistory({ property = {}, address = null }) {
  const { isLoggedIn, loading: authLoading, token } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | empty | error
  const [errorMsg, setErrorMsg] = useState("");

  const listingType = property?.type || "RS";
  const subType = property?.sub_type || "";
  const isCommercial = /commercial/i.test(String(subType));
  const shouldShow = listingType === "RS" && !isCommercial;

  const addrLabel = address || property?.addr || "this property";

  const queryString = useMemo(() => {
    return buildHistoryQuery({
      id: property?.id,
      brd: property?.brd,
      sub_type: property?.sub_type,
      st_num: property?.st_num,
      apt_num: property?.apt_num,
      st: property?.st,
      zip: property?.zip,
      addr_slug: property?.addr_slug,
    }).toString();
  }, [
    property?.id,
    property?.brd,
    property?.sub_type,
    property?.st_num,
    property?.apt_num,
    property?.st,
    property?.zip,
    property?.addr_slug,
  ]);

  const fetchHistory = useCallback(async () => {
    if (!isLoggedIn) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/listing-history?${queryString}`, {
        headers,
        cache: "no-store",
      });

      if (res.status === 401) {
        setShowLogin(true);
        setStatus("idle");
        return;
      }

      if (!res.ok) {
        throw new Error("Unable to load history right now.");
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.rows || data?.data || [];

      if (!list.length) {
        setRows([]);
        setStatus("empty");
        return;
      }

      setRows(
        list.map((item) =>
          mapHistoryItem(item, property?.id, "single"),
        ),
      );
      setStatus("ready");
    } catch (err) {
      setRows([]);
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong.");
    }
  }, [isLoggedIn, token, queryString, property?.id]);

  useEffect(() => {
    if (!shouldShow) return;
    if (authLoading) return;
    if (!isLoggedIn) {
      setRows([]);
      setStatus("idle");
      return;
    }
    fetchHistory();
  }, [shouldShow, authLoading, isLoggedIn, fetchHistory]);

  if (!shouldShow) return null;

  return (
    <section className="w-full overflow-x-hidden py-4">
      <h2 className="mb-2 break-words text-xl font-bold text-[#0B132B] sm:text-2xl lg:text-3xl">
        Sale/Lease History of {addrLabel}
      </h2>
      <p className="mb-4 text-sm text-slate-500 sm:mb-5">
        View all past sales, leases, and listings of the property at{" "}
        {addrLabel}.
      </p>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {!isLoggedIn && !authLoading ? (
          <>
            <div
              className="pointer-events-none select-none px-4 py-2 sm:px-5"
              aria-hidden="true"
              style={{ filter: "blur(7px)" }}
            >
              <ul className="relative border-l-2 border-orange-100 ml-1.5 space-y-0">
                {PLACEHOLDER_ROWS.map((row) => (
                  <HistoryRow
                    key={row.date}
                    date={row.date}
                    title={
                      row.sold ? (
                        <>
                          <s className="text-slate-400">{row.listed}</s>
                          <span className="mx-2">&nbsp;</span>
                          <span>{row.sold}</span>
                        </>
                      ) : (
                        `Was Listed for Sale: ${row.listed}`
                      )
                    }
                    note={row.note}
                    noteTone={row.soldDeal ? "success" : "danger"}
                  />
                ))}
              </ul>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-white via-white/95 to-transparent px-4 pb-5 pt-16">
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#0B132B] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#151f3a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F36B22] focus-visible:ring-offset-2"
              >
                <Lock size={15} className="shrink-0 opacity-90" />
                Login to view
              </button>
            </div>
          </>
        ) : (
          <div className="px-4 py-2 sm:px-5">
            {(authLoading || status === "loading") && (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
                <Loader2 size={18} className="animate-spin text-[#F36B22]" />
                Loading history…
              </div>
            )}

            {!authLoading && status === "empty" && (
              <p className="py-10 text-center text-sm font-medium text-slate-500">
                No history available
              </p>
            )}

            {!authLoading && status === "error" && (
              <div className="py-10 text-center">
                <p className="text-sm text-rose-600">{errorMsg}</p>
                <button
                  type="button"
                  onClick={fetchHistory}
                  className="mt-3 text-sm font-semibold text-[#F36B22] hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!authLoading && status === "ready" && rows.length > 0 && (
              <ul className="relative ml-1.5 border-l-2 border-orange-100">
                {rows.map((row) => (
                  <HistoryRow
                    key={row.key}
                    date={row.date}
                    title={row.title}
                    note={row.note}
                    noteTone={row.noteTone}
                    viewHref={row.viewHref}
                    compareHref={row.compareHref}
                    isArchive={row.isArchive}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        signup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        login={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </section>
  );
}
