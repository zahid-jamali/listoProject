"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import { Home, DollarSign, Building2, FileBarChart2 } from "lucide-react";

const pieData = [
  { name: "Detached", value: 754 },
  { name: "Semi Detached", value: 282 },
  { name: "Townhouse", value: 85 },
  { name: "Condo", value: 977 },
];

const COLORS = ["#4F46E5", "#7C3AED", "#A855F7", "#F97316"];

const marketData = [
  { month: "Jan", score: 28 },
  { month: "Feb", score: 34 },
  { month: "Mar", score: 41 },
  { month: "Apr", score: 38 },
  { month: "May", score: 47 },
  { month: "Jun", score: 56 },
];

const activityData = [
  { month: "Dec", listed: 800, sold: 500 },
  { month: "Jan", listed: 950, sold: 620 },
  { month: "Feb", listed: 1100, sold: 700 },
  { month: "Mar", listed: 1400, sold: 900 },
  { month: "Apr", listed: 1700, sold: 1200 },
];

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{title}</span>
        {icon}
      </div>

      <h3 className="mt-3 text-2xl font-bold">{value}</h3>
    </div>
  );
}

function GaugeCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-full">
      <h3 className="font-semibold text-lg text-center mb-6">Market Pulse</h3>

      <div className="relative mx-auto w-48 h-24 overflow-hidden">
        <div className="absolute inset-0 rounded-t-full border-[16px] border-orange-500 border-b-0"></div>

        <div
          className="absolute bottom-0 left-1/2 origin-bottom"
          style={{
            transform: "translateX(-50%) rotate(-25deg)",
          }}
        >
          <div className="w-1 h-20 bg-black rounded-full"></div>
        </div>
      </div>

      <div className="text-center mt-4">
        <h2 className="text-2xl font-bold">Balanced</h2>

        <p className="text-sm text-gray-500 mt-2">
          Inventory levels are currently meeting buyer demand.
        </p>
      </div>

      <div className="flex justify-between mt-8 text-xs text-gray-500">
        <span>Sellers</span>
        <span>Buyers</span>
      </div>
    </div>
  );
}

export default function CityDashboardPage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}

        <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">
          <h1 className="font-bold text-3xl">Stats for Toronto</h1>
        </div>

        {/* TOP SECTION */}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Cards */}

          <div>
            <h2 className="font-bold text-3xl mb-4">Active Listings</h2>

            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="Homes Sold"
                value="1094"
                icon={<Home size={18} className="text-orange-500" />}
              />

              <StatCard
                title="Avg Sold Price"
                value="$1.25M"
                icon={<DollarSign size={18} className="text-orange-500" />}
              />

              <StatCard
                title="Active Listings"
                value="3036"
                icon={<Building2 size={18} className="text-orange-500" />}
              />

              <StatCard
                title="Sold / List"
                value="98%"
                icon={<FileBarChart2 size={18} className="text-orange-500" />}
              />
            </div>
          </div>

          {/* Pie */}

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-bold text-3xl mb-6">Home Types</h2>

            <div className="h-[300px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={65}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.map((item, i) => (
                <div key={i} className="text-sm">
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Pulse */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-bold text-2xl mb-5">Market Pulse</h2>

            <div className="h-[350px]">
              <ResponsiveContainer>
                <LineChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />
                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#F97316"
                    strokeWidth={4}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <GaugeCard />
        </div>

        {/* Recent Activity */}

        <div className="mt-10 bg-[#020d29] text-white rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-1">Recent Activity</h2>

          <p className="text-sm text-slate-400 mb-6">
            Comparative flow of market inventory
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white text-black rounded-xl p-4">
              <p className="text-sm text-gray-500">Solds</p>

              <h3 className="text-2xl font-bold">1,124</h3>
            </div>

            <div className="bg-white text-black rounded-xl p-4">
              <p className="text-sm text-gray-500">Listed</p>

              <h3 className="text-2xl font-bold">3,438</h3>
            </div>

            <div className="bg-white text-black rounded-xl p-4">
              <p className="text-sm text-gray-500">Avg Change</p>

              <h3 className="text-2xl font-bold">$1.2M</h3>
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="listed"
                  stroke="#F97316"
                  fill="#F97316"
                  fillOpacity={0.2}
                />

                <Area
                  type="monotone"
                  dataKey="sold"
                  stroke="#ffffff"
                  fill="#ffffff"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
