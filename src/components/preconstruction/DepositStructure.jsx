"use client";

export default function DepositStructure({
  project = {},
  showcase1 = null,
}) {
  const depositHtml = project?.deposit;
  const incentiveHtml = project?.incentive;
  const incentiveListoHtml = project?.incentive_listo;
  const showcase = showcase1 || project?.showcase1;

  if (!depositHtml && !incentiveHtml && !incentiveListoHtml && !showcase?.items?.length) {
    return null;
  }

  return (
    <section className="w-full space-y-6 py-2">
      {showcase?.items?.length > 0 && (
        <div>
          <h2 className="mb-2 text-2xl font-bold text-[#0B132B] lg:text-3xl">
            {showcase.title || "Why Invest"}
          </h2>
          {showcase.sub_title ? (
            <p className="mb-4 text-sm text-slate-500">{showcase.sub_title}</p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-3">
            {showcase.items.map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"
              >
                {item.val ? (
                  <p className="text-2xl font-black text-[#F36B22]">{item.val}</p>
                ) : null}
                <p className="mt-1 text-sm font-semibold text-[#0B132B]">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {incentiveHtml ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-3 text-xl font-bold text-[#0B132B]">
            Current Incentives
          </h2>
          <div
            className="prose prose-sm max-w-none text-slate-700"
            dangerouslySetInnerHTML={{ __html: incentiveHtml }}
          />
        </div>
      ) : null}

      {incentiveListoHtml ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-3 text-xl font-bold text-[#0B132B]">
            Listo&apos;s Exclusive Incentives
          </h2>
          <div
            className="prose prose-sm max-w-none text-slate-700"
            dangerouslySetInnerHTML={{ __html: incentiveListoHtml }}
          />
        </div>
      ) : null}

      {depositHtml ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-3 text-xl font-bold text-[#0B132B]">
            Deposit Structure
          </h2>
          <div
            className="prose prose-sm max-w-none text-slate-700"
            dangerouslySetInnerHTML={{ __html: depositHtml }}
          />
        </div>
      ) : null}
    </section>
  );
}
