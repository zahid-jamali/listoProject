import { CheckCircle2 } from "lucide-react";

function formatCurrency(value) {
  const num = Number(String(value || "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num)) return value || "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(num);
}

// The original VS-style layout — used for the first comparable
function ComparisonVsCard({ currentHero, comp, tone }) {
  return (
    <div className="relative grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,430px)_minmax(0,1fr)] xl:gap-10">
      {/* VS Badge */}
      <div className="absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 xl:flex">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#1d1d1d] bg-[#F36B22] text-lg font-bold text-white shadow-xl">
          VS
        </div>
      </div>

      {/* LEFT CARD — subject property */}
      <div className="flex min-w-0 flex-col justify-between rounded-2xl bg-[#061126] p-3 text-white shadow-[0_15px_40px_rgba(0,0,0,0.25)] sm:rounded-[32px] sm:p-4">
        <div>
          <div className="overflow-hidden rounded-xl sm:rounded-[20px]">
            {currentHero?.heroImage ? (
              <img
                src={currentHero.heroImage}
                alt="Your property"
                className="h-[200px] w-full object-cover sm:h-[260px] xl:h-[300px]"
              />
            ) : (
              <div className="flex h-[200px] w-full items-center justify-center rounded-xl bg-slate-700 text-sm text-slate-400 sm:h-[260px] sm:rounded-[20px] xl:h-[300px]">
                No photo
              </div>
            )}
          </div>

          <div className="px-1 py-3 sm:px-2 sm:py-4">
            <h2 className="break-words text-lg font-extrabold leading-none sm:text-xl">
              {currentHero?.priceText || formatCurrency(currentHero?.price)}
            </h2>

            <p className="mt-2 break-words text-sm text-[#A6ADBB] sm:mt-3 sm:text-base">
              {currentHero?.title || "—"}
            </p>
          </div>
        </div>

        <div className="px-2 mt-auto border-t border-[#4B5563]">
          <div className="flex justify-between py-3 border-b border-[#4B5563]">
            <span className="text-[#A6ADBB] text-sm">Beds</span>
            <span className="text-sm font-medium">
              {currentHero?.beds || "—"}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-[#4B5563]">
            <span className="text-[#A6ADBB] text-sm">Baths</span>
            <span className="text-sm font-medium">
              {currentHero?.baths || "—"}
            </span>
          </div>

          <div className="flex justify-between py-3">
            <span className="text-[#A6ADBB] text-sm">Size</span>
            <span className="text-sm font-medium">
              {currentHero?.sqft ? `${currentHero.sqft} sqft` : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT CARD — comparable */}
      <div className="flex min-w-0 flex-col justify-between rounded-2xl bg-[#061126] p-4 text-white shadow-[0_15px_40px_rgba(0,0,0,0.25)] sm:rounded-[32px] sm:p-6">
        {/* Top Section */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-6">
          <div className="min-w-0 space-y-2 py-2 sm:px-2 sm:py-6 sm:px-6">
            <h2 className="break-words text-xl font-extrabold leading-none sm:text-2xl">
              {comp.lp_dol_text || formatCurrency(comp.lp_dol)}
            </h2>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="break-words text-sm text-[#A6ADBB] sm:text-base">
                {comp.addr}
              </span>
            </div>
          </div>

          {comp.thumbnail && (
            <img
              src={comp.thumbnail}
              alt={comp.addr}
              className="h-[120px] w-full rounded-xl object-cover sm:h-[100px] sm:w-[160px] sm:shrink-0"
            />
          )}
        </div>

        {/* Stats Box */}
        <div className="mt-2 border border-[#4B5563] rounded-xl overflow-hidden bg-[#0a1936]">
          <div className="grid grid-cols-3 divide-x divide-[#4B5563]">
            <div className="py-3 text-center">
              <h4 className="text-xs text-[#A6ADBB] uppercase tracking-wider font-semibold">
                Beds
              </h4>
              <p className="mt-1 text-lg font-bold text-[#F36B22]">
                {comp.br || "—"}
              </p>
            </div>

            <div className="py-3 text-center">
              <h4 className="text-xs text-[#A6ADBB] uppercase tracking-wider font-semibold">
                Baths
              </h4>
              <p className="mt-1 text-lg font-bold text-[#F36B22]">
                {comp.bath_tot || "—"}
              </p>
            </div>

            <div className="py-3 text-center">
              <h4 className="text-xs text-[#A6ADBB] uppercase tracking-wider font-semibold">
                Size
              </h4>
              <p className="mt-1 text-sm font-bold text-[#F36B22] truncate px-1">
                {comp.sqft || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6">
          <h3 className="text-base font-bold text-[#F36B22] mb-3 flex items-center gap-1.5">
            <span>✧</span> AI Summary
          </h3>

          <div className="space-y-2.5">
            <div className="flex gap-2.5 items-start">
              <CheckCircle2
                size={16}
                className="text-[#F36B22] mt-0.5 shrink-0"
              />
              <span className="text-sm text-gray-200">
                {comp.addr} — {comp.lp_dol_text || formatCurrency(comp.lp_dol)}
              </span>
            </div>

            <div className="flex gap-2.5 items-start">
              <CheckCircle2
                size={16}
                className="text-[#F36B22] mt-0.5 shrink-0"
              />
              <span className="text-sm text-gray-200">
                {comp.br || "—"} beds · {comp.bath_tot || "—"} baths ·{" "}
                {comp.sqft || "—"} sqft
              </span>
            </div>

            {comp.community && (
              <div className="flex gap-2.5 items-start">
                <CheckCircle2
                  size={16}
                  className="text-[#6B7280] mt-0.5 shrink-0"
                />
                <span className="text-sm text-[#A6ADBB]">
                  Located in{" "}
                  {[comp.community, comp.municipality]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Conclusion */}
        <div className="border-t border-[#4B5563] mt-6 pt-4">
          <p className="text-base font-semibold leading-relaxed text-gray-100 italic">
            "{comp.addr} is a comparable {tone === "sold" ? "sold" : "active"}{" "}
            listing in the area."
          </p>
        </div>
      </div>
    </div>
  );
}

// Compact row card for additional comparables
function ComparisonRowCard({ comp, tone }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#1e293b] bg-[#061126] p-4 text-white">
      <div className="flex min-w-0 flex-1 gap-4">
        {comp.thumbnail && (
          <img
            src={comp.thumbnail}
            alt=""
            className="h-20 w-28 rounded-xl object-cover flex-shrink-0"
          />
        )}
        <div>
          <p className="text-xl font-bold">
            {comp.lp_dol_text || formatCurrency(comp.lp_dol)}
          </p>
          <p className="font-medium text-[#A6ADBB]">{comp.addr}</p>
          <p className="text-sm text-[#6B7280]">
            {[comp.community, comp.municipality].filter(Boolean).join(" • ")}
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#6B7280]">
            {comp.br && <span>{comp.br} beds</span>}
            {comp.bath_tot && <span>{comp.bath_tot} baths</span>}
            {comp.sqft && <span>{comp.sqft} sqft</span>}
          </div>
        </div>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
          tone === "sold"
            ? "bg-slate-700 text-slate-300"
            : "bg-green-900/40 text-green-400"
        }`}
      >
        {tone === "sold" ? "Sold" : comp.listing_text || "Active"}
      </span>
    </div>
  );
}

export default function ComparisonCard({
  comps = [],
  tone = "active",
  currentHero,
}) {
  if (!comps.length) return null;

  const [first, ...rest] = comps;

  return (
    <div className="space-y-6">
      {/* VS card for first comp */}
      <ComparisonVsCard currentHero={currentHero} comp={first} tone={tone} />

      {/* Row cards for remaining comps */}
      {rest.slice(0, 3).map((comp) => (
        <ComparisonRowCard key={comp.id} comp={comp} tone={tone} />
      ))}
    </div>
  );
}
