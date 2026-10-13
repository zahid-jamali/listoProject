"use client";

import { useMemo, useState } from "react";
import { Wallet } from "lucide-react";

const TABS = [
  { id: "property", label: "Property" },
  { id: "details", label: "Details" },
  { id: "rooms", label: "Room Sizes" },
];

function display(value) {
  if (value === null || value === undefined || value === "") return "—";
  return value;
}

function SpecRow({ label, value, icon = null }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2.5 last:border-b-0 sm:grid sm:grid-cols-[150px_1fr] sm:gap-3">
      <dt className="flex items-start gap-1.5 text-xs font-bold text-[#0B132B] sm:text-sm">
        {icon}
        {label}:
      </dt>
      <dd className="break-words text-sm text-slate-700">{display(value)}</dd>
    </div>
  );
}

function LotSketch({ width, depth }) {
  const w = Number(width);
  const d = Number(depth);
  if (!Number.isFinite(w) || !Number.isFinite(d) || w <= 0 || d <= 0) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center gap-4">
      <p className="text-sm font-bold text-[#0B132B]">Lot:</p>
      <div className="relative h-24 w-40 border-2 border-slate-300 bg-slate-100">
        <span className="absolute -left-7 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600">
          {Math.round(w)}
        </span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-600">
          {Math.round(d)}
        </span>
      </div>
    </div>
  );
}

export default function PropertyDetails({ details = {}, beds, baths }) {
  const [activeTab, setActiveTab] = useState("property");
  const rooms = details?.rooms || [];
  const isCommercial = /commercial/i.test(String(details?.propertyClass || ""));

  const visibleTabs = useMemo(
    () => (isCommercial ? TABS.filter((tab) => tab.id !== "rooms") : TABS),
    [isCommercial],
  );

  const propertyLeft = [
    { label: "MLS® #", value: details?.mlsId },
    { label: "Property Type", value: details?.propertyType },
    { label: "Property Style", value: details?.propertyStyle },
    { label: "Area", value: details?.area },
    { label: "Community", value: details?.community },
    {
      label: "Taxes",
      value: details?.taxes,
      icon: <Wallet className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />,
    },
    { label: "Added", value: details?.added },
    { label: "Lot Frontage", value: details?.lotWidth },
    { label: "Lot Depth", value: details?.lotDepth },
  ];

  const propertyRight = [
    { label: "Status", value: details?.status },
    { label: "Outside", value: details?.exterior },
    { label: "Year Built", value: details?.yearBuilt },
    { label: "Basement", value: details?.basement },
    { label: "Brokerage", value: details?.brokerage },
  ];

  const detailsLeft = [
    { label: "Intersection", value: details?.crossStreet },
    { label: "Rooms", value: details?.roomsCount },
    { label: "Bedrooms", value: details?.beds || beds },
    { label: "Bathrooms", value: details?.baths || baths },
    { label: "Fireplace", value: details?.fireplace },
  ];

  const detailsRight = [
    { label: "Water", value: details?.water },
    { label: "Cooling", value: details?.cooling },
    { label: "Heating Type", value: details?.heating },
    { label: "Heating Fuel", value: details?.heatingFuel },
  ];

  return (
    <section className="w-full py-2">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Tabs */}
        <div className="border-b border-slate-200 px-4 sm:px-6">
          <nav
            className="flex gap-6 overflow-x-auto"
            aria-label="Property sections"
          >
            {visibleTabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative whitespace-nowrap py-4 text-sm font-bold uppercase tracking-[0.04em] transition ${
                    active
                      ? "text-[#F36B22]"
                      : "text-[#0B132B] hover:text-[#F36B22]"
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#F36B22]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab panels */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === "property" && (
            <div>
              <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
                <dl className="min-w-0">
                  {propertyLeft.map((item) => (
                    <SpecRow
                      key={item.label}
                      label={item.label}
                      value={item.value}
                      icon={item.icon}
                    />
                  ))}
                </dl>
                <dl className="min-w-0">
                  {propertyRight.map((item) => (
                    <SpecRow
                      key={item.label}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </dl>
              </div>
              {/* <LotSketch width={details?.lotWidth} depth={details?.lotDepth} /> */}
            </div>
          )}

          {activeTab === "details" && (
            <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
              <dl className="min-w-0">
                {detailsLeft.map((item) => (
                  <SpecRow
                    key={item.label}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </dl>
              <div className="min-w-0">
                <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[#0B132B] underline decoration-slate-400 underline-offset-4">
                  Utilities
                </p>
                <dl>
                  {detailsRight.map((item) => (
                    <SpecRow
                      key={item.label}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </dl>
              </div>
            </div>
          )}

          {activeTab === "rooms" && (
            <div>
              {rooms.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Room sizes are not available for this listing.
                </p>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {rooms.map((room, index) => (
                    <li
                      key={`${room.description}-${index}`}
                      className="py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="text-sm font-bold text-[#0B132B]">
                          {room.description}
                        </p>
                        {room.dimensions && (
                          <p className="text-sm text-slate-700">
                            {room.dimensions}
                          </p>
                        )}
                      </div>
                      {(room.featuresText || room.features?.length > 0) && (
                        <p className="mt-1 text-sm text-slate-600">
                          {room.featuresText || room.features.join(", ")}
                        </p>
                      )}
                      {room.level && (
                        <p className="mt-1 text-sm text-slate-500">
                          {room.level} Level
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Listing Details / Description */}
      {(details?.adText || details?.extras) && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-[#EEF1F6] px-5 py-3 sm:px-6">
            <h2 className="text-xl font-bold tracking-tight text-[#0B132B]">
              Listing Details
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-7 text-slate-700 sm:px-6 sm:py-6 sm:text-[15px]">
            {details?.adText && (
              <p className="whitespace-pre-wrap">{details.adText}</p>
            )}
            {details?.extras && (
              <p className="whitespace-pre-wrap">{details.extras}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
