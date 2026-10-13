function formatCurrency(value) {
  const num = Number(String(value || "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num)) return value || "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(num);
}

export default function AreaInsights({ insights = [], heroTitle }) {
  // Don't render section if no real insights
  if (!insights.length) return null;

  return (
    <section className="w-full py-6">
      {/* Header Section */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-[#0B132B] md:text-3xl">
          {heroTitle ? `Insights for ${heroTitle}` : "Local Insights"}
        </h2>

        <button className="self-start sm:self-auto border border-[#F36B22] text-[#F36B22] hover:bg-[#F36B22] hover:text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 shadow-md">
          View Full Report
        </button>
      </div>

      {/* Homes Grid */}
      <div className="grid grid-cols-1 gap-6">
        {insights.slice(0, 6).map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="overflow-hidden rounded-[24px] bg-[#061126] text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[#1e293b]/50 hover:border-[#F36B22]/30 transition-all duration-300"
          >
            <div className="grid grid-cols-[150px_1fr] sm:grid-cols-[180px_1fr] h-full">
              {/* Image Container */}
              <div className="relative h-full min-h-[160px]">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.addr || "Property"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-700 flex items-center justify-center text-slate-500 text-xs">
                    No photo
                  </div>
                )}
              </div>

              {/* Content Box */}
              <div className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                      {item.insight_desc || "INSIGHT"}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-xl font-extrabold text-white tracking-tight">
                    {item.lp_dol_text || formatCurrency(item.lp_dol)}
                  </h3>

                  <p className="mt-1 text-sm text-[#A6ADBB]">{item.addr}</p>
                </div>

                {/* Specs Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.br && (
                    <span className="bg-[#394255]/50 text-gray-200 rounded-lg px-2.5 py-1 text-xs font-medium">
                      {item.br} Beds
                    </span>
                  )}
                  {item.bath_tot && (
                    <span className="bg-[#394255]/50 text-gray-200 rounded-lg px-2.5 py-1 text-xs font-medium">
                      {item.bath_tot} Baths
                    </span>
                  )}
                  {item.sqft && (
                    <span className="bg-[#394255]/50 text-gray-200 rounded-lg px-2.5 py-1 text-xs font-medium">
                      {item.sqft} sqft
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
