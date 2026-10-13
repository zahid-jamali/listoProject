"use client";

import { MapPin, TrendingUp, DollarSign, Home } from "lucide-react";

export default function LocationMap({ mapUrl }) {
  return (
    <section className="w-full overflow-x-hidden py-4">
      <h2 className="mb-4 text-xl font-bold text-[#0B132B] sm:mb-6 sm:text-2xl lg:text-3xl">
        Location Information
      </h2>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <div className="min-w-0 overflow-hidden rounded-2xl bg-white shadow sm:rounded-3xl">
          {mapUrl ? (
            <iframe
              title="Property location map"
              src={mapUrl}
              className="h-[260px] w-full border-0 sm:h-[360px] lg:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-[260px] items-center justify-center bg-slate-100 text-sm text-slate-500 sm:h-[360px] lg:h-[420px]">
              Map unavailable for this listing
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 sm:rounded-3xl sm:p-6">
          <div className="mb-4 flex items-center gap-2 sm:mb-6">
            <TrendingUp className="text-orange-500" size={20} />
            <h3 className="text-lg font-bold sm:text-xl">AI Market Insight</h3>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div>
              <div className="flex gap-3">
                <DollarSign className="shrink-0 text-orange-500" size={18} />
                <div className="min-w-0">
                  <h4 className="font-semibold">Strong Appreciation</h4>
                  <p className="text-sm text-gray-600">
                    Property values increased 8.4% over last 12 months.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex gap-3">
                <Home className="shrink-0 text-orange-500" size={18} />
                <div className="min-w-0">
                  <h4 className="font-semibold">Inventory Tight</h4>
                  <p className="text-sm text-gray-600">
                    Homes selling quickly with low inventory.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex gap-3">
                <MapPin className="shrink-0 text-orange-500" size={18} />
                <div className="min-w-0">
                  <h4 className="font-semibold">Desirable Area</h4>
                  <p className="text-sm text-gray-600">
                    Excellent transit and schools nearby.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const target = mapUrl
                ? mapUrl.replace(/[&?]output=embed/g, "")
                : "https://www.google.com/maps";
              window.open(target, "_blank", "noopener,noreferrer");
            }}
            className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 sm:mt-8"
          >
            View on Map
          </button>
        </div>
      </div>
    </section>
  );
}
