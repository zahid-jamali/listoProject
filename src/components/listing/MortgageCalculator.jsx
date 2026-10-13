function formatCurrency(value) {
  const num = Number(String(value || "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(num);
}

export default function MortgageCalculator({
  calculatorInputs,
  calculatorResults,
  onInputChange,
}) {
  const homePrice = calculatorInputs?.homePrice ?? 799000;
  const downPaymentPercent = calculatorInputs?.downPaymentPercent ?? 20;
  const interestRate = calculatorInputs?.interestRate ?? 5.4;
  const termYears = calculatorInputs?.termYears ?? 25;

  return (
    <section className="mt-4 w-full overflow-x-hidden rounded-2xl bg-[#f5f2ee] py-6 sm:mt-6 sm:rounded-3xl sm:py-8 lg:py-10">
      <div className="px-1">
        <h2 className="mb-5 text-xl font-black leading-tight text-[#0B132B] sm:mb-8 sm:text-2xl">
          SEE WHAT OWNING THIS HOME ACTUALLY COSTS.
        </h2>

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
          {/* Inputs */}
          <div className="rounded-2xl bg-white p-4 shadow sm:rounded-3xl sm:p-6 md:p-8">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <div className="mb-1 flex justify-between gap-3 text-sm sm:text-base">
                  <span>Home Price</span>
                  <span className="shrink-0 font-semibold">
                    {formatCurrency(homePrice)}
                  </span>
                </div>
                <input
                  type="range"
                  className="w-full accent-[#F58232]"
                  min={200000}
                  max={5000000}
                  step={10000}
                  value={homePrice}
                  onChange={(e) =>
                    onInputChange?.("homePrice", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between gap-3 text-sm sm:text-base">
                  <span>Down Payment</span>
                  <span className="shrink-0 font-semibold">
                    {downPaymentPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  className="w-full accent-[#F58232]"
                  min={5}
                  max={50}
                  step={5}
                  value={downPaymentPercent}
                  onChange={(e) =>
                    onInputChange?.(
                      "downPaymentPercent",
                      Number(e.target.value),
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between gap-3 text-sm sm:text-base">
                  <span>Interest Rate</span>
                  <span className="shrink-0 font-semibold">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  className="w-full accent-[#F58232]"
                  min={2}
                  max={10}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) =>
                    onInputChange?.("interestRate", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between gap-3 text-sm sm:text-base">
                  <span>Term</span>
                  <span className="shrink-0 font-semibold">
                    {termYears} Years
                  </span>
                </div>
                <input
                  type="range"
                  className="w-full accent-[#F58232]"
                  min={5}
                  max={30}
                  step={5}
                  value={termYears}
                  onChange={(e) =>
                    onInputChange?.("termYears", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-2xl bg-[#001538] p-4 text-white shadow-xl sm:rounded-3xl sm:p-6 md:p-8">
            <h3 className="text-xs tracking-wide text-slate-400 sm:text-sm">
              ESTIMATED MONTHLY PAYMENT
            </h3>

            <div className="mt-3 break-words text-3xl font-black sm:mt-4 sm:text-4xl">
              {formatCurrency(calculatorResults?.estimatedMonthly)}
              <span className="text-sm font-medium text-slate-400 sm:text-base">
                {" "}
                /mo
              </span>
            </div>

            {calculatorResults?.affordabilityScore && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-900/30 px-3 py-1">
                <span className="text-xs uppercase tracking-wide text-green-400">
                  Affordability
                </span>
                <span className="text-sm font-black text-green-300">
                  {calculatorResults.affordabilityScore}
                </span>
              </div>
            )}

            <div className="mt-6 space-y-3 text-sm text-slate-300 sm:mt-8">
              <div className="flex justify-between gap-3">
                <span>Loan Amount</span>
                <span className="shrink-0 font-semibold">
                  {formatCurrency(calculatorResults?.loanAmount)}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Down Payment</span>
                <span className="shrink-0 font-semibold">
                  {formatCurrency(calculatorResults?.downPayment)}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Property Tax (est.)</span>
                <span className="shrink-0 font-semibold">
                  {formatCurrency(calculatorResults?.propertyTaxMonthly)} / mo
                </span>
              </div>
            </div>

            <button
              type="button"
              className="mt-8 w-full rounded-full bg-orange-500 py-3.5 font-bold transition hover:bg-orange-600 sm:mt-10 sm:py-4"
            >
              Get Pre Approved
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
