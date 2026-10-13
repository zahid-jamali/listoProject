"use client";

export default function PreConstructionFeaturesAndFacilities({
  features = [],
  highlights = [],
  showcase2 = null,
  project = {},
}) {
  const featureList =
    features?.length > 0
      ? features
      : (project?.features_json || []).map((f) =>
          typeof f === "string" ? { text: f } : f,
        );

  const highlightList = highlights?.length
    ? highlights
    : project?.highlights || [];

  const locationFacts = showcase2 || project?.showcase2;

  if (
    !featureList.length &&
    !highlightList.length &&
    !locationFacts?.items?.length
  ) {
    return null;
  }

  return (
    <section className="w-full space-y-8 py-2">
      {featureList.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#0B132B] lg:text-3xl">
            Features
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featureList.map((feature, idx) => {
              const label =
                typeof feature === "string"
                  ? feature
                  : feature?.text || feature?.name || "Feature";
              return (
                <div
                  key={`${label}-${idx}`}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0B132B] shadow-sm"
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {highlightList.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#0B132B] lg:text-3xl">
            Highlights
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {highlightList.map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"
              >
                {item.val ? (
                  <p className="text-xl font-black text-[#F36B22]">{item.val}</p>
                ) : null}
                <p className="mt-1 text-sm font-semibold text-[#0B132B]">
                  {item.name}
                </p>
                {item.info ? (
                  <p className="mt-1 text-xs text-slate-500">{item.info}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {locationFacts?.items?.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#0B132B] lg:text-3xl">
            {locationFacts.title || "Location Facts"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {locationFacts.items.map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"
              >
                {item.img ? (
                  <img
                    src={
                      String(item.img).startsWith("http")
                        ? item.img
                        : `https://listo.ca${item.img}`
                    }
                    alt=""
                    className="mx-auto mb-2 h-12 w-12 object-contain"
                  />
                ) : null}
                <p className="text-sm font-semibold text-[#0B132B]">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
