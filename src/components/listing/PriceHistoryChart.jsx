"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const TREND_LINES = [
  { key: "detached", color: "#FF5C5C", label: "Detached" },
  { key: "semi", color: "#20C997", label: "Semi" },
  { key: "townhouse", color: "#3B82F6", label: "Townhouse" },
  { key: "condo", color: "#8B5CF6", label: "Condo" },
];

const FALLBACK_DATA = [
  { month: "Nov", detached: 950, semi: 720, townhouse: 810, condo: 580 },
  { month: "Dec", detached: 960, semi: 730, townhouse: 820, condo: 590 },
  { month: "Jan", detached: 980, semi: 740, townhouse: 840, condo: 600 },
  { month: "Feb", detached: 1000, semi: 760, townhouse: 850, condo: 610 },
  { month: "Mar", detached: 1020, semi: 770, townhouse: 870, condo: 620 },
  { month: "Apr", detached: 1050, semi: 790, townhouse: 890, condo: 640 },
];

export default function PriceHistoryChart({ chartData, municipality }) {
  const data = chartData?.length > 0 ? chartData : FALLBACK_DATA;
  const areaName = municipality || "Area";

  return (
    <section className="w-full overflow-x-hidden py-4 sm:py-6">
      <div className="rounded-2xl bg-[#001538] p-4 sm:rounded-3xl sm:p-6 lg:p-8">
        <h2 className="mb-1 break-words text-xl font-bold text-white sm:mb-2 sm:text-2xl lg:text-3xl">
          {areaName} Home Prices
        </h2>
        <p className="mb-5 text-xs text-[#F58232] sm:mb-8">
          6-month valuation trend across asset classes
        </p>

        <div className="h-[240px] w-full min-w-0 sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="#1f3358" vertical={false} />
              <XAxis
                stroke="#fff"
                dataKey="month"
                tick={{ fill: "#fff", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#fff"
                width={36}
                tick={{ fill: "#fff", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "none",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 12,
                }}
                formatter={(value) => [`$${value}k`]}
              />
              {TREND_LINES.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  stroke={line.color}
                  strokeWidth={2.5}
                  dot={false}
                  name={line.label}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:mt-6 sm:gap-6">
          {TREND_LINES.map((line) => (
            <div key={line.key} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
                style={{ background: line.color }}
              />
              <span className="text-[10px] uppercase tracking-wide text-white sm:text-[11px]">
                {line.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
