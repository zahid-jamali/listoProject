"use client";

import { Building2, Maximize2, Layers } from "lucide-react";

function formatMoney(value, country) {
  const n = Number(String(value || "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  if (String(country).toUpperCase() === "UAE") {
    return `AED ${n.toLocaleString("en-US")}`;
  }
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Legacy "What's being built" = development products table.
 * Models (floor plans) render separately when available.
 */
export default function WhatsBeingBuilt({
  products = [],
  models = [],
  project = {},
}) {
  const hasProducts = products?.length > 0;
  const hasModels = models?.length > 0;

  if (!hasProducts && !hasModels) return null;

  return (
    <section className="w-full space-y-8 py-2">
      {hasProducts && (
        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#0B132B] lg:text-3xl">
            What&apos;s being built
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {products.map((product) => {
              const units =
                product?.units && typeof product.units === "object"
                  ? Object.entries(product.units)
                      .filter(([, v]) => v != null && v !== "")
                      .map(([k, v]) => `${v} ${k}`)
                      .join(" · ")
                  : null;
              const price =
                product.lp_dol_text ||
                formatMoney(product.lp_dol, project?.country);

              return (
                <div
                  key={product.id || product.product_type}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-[#0B132B]">
                      {product.product_type_name || product.product_type}
                    </h3>
                    <Building2 className="h-5 w-5 shrink-0 text-slate-300" />
                  </div>
                  {product.tenure_desc && (
                    <p className="text-sm text-slate-500">{product.tenure_desc}</p>
                  )}
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm text-slate-700">
                    {(product.sqft_min || product.sqft_max) && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 text-slate-500">
                          <Maximize2 size={14} /> Sqft
                        </span>
                        <span className="font-semibold">
                          {product.sqft_min}
                          {product.sqft_max ? ` – ${product.sqft_max}` : ""}
                        </span>
                      </div>
                    )}
                    {units && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 text-slate-500">
                          <Layers size={14} /> Units
                        </span>
                        <span className="font-semibold">{units}</span>
                      </div>
                    )}
                    {price && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">From</span>
                        <span className="font-bold text-[#F36B22]">{price}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasModels && (
        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#0B132B] lg:text-3xl">
            Models / Floor Plans
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Model</th>
                  <th className="px-4 py-3 font-semibold">Beds</th>
                  <th className="px-4 py-3 font-semibold">Baths</th>
                  <th className="px-4 py-3 font-semibold">Sqft</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr
                    key={model.id}
                    className="border-b border-slate-50 last:border-b-0"
                  >
                    <td className="px-4 py-3 font-semibold text-[#0B132B]">
                      {model.name || "—"}
                      {model.descrip ? (
                        <p className="mt-0.5 text-xs font-normal text-slate-500">
                          {model.descrip}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{model.br || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {model.bath_tot || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {model.sqft || "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#F36B22]">
                      {model.lp_dol_text ||
                        formatMoney(model.lp_dol, project?.country) ||
                        "Contact us"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
