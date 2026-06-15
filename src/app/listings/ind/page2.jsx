"use client";

import {
  Lock,
  BedDouble,
  Bath,
  Ruler,
  Trees,
  School,
  Bus,
  Bike,
  MapPin,
  Sparkles,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Home, ArrowUpRight } from "lucide-react";

export default function PropertyPage() {
  const features = [
    "Fenced Yard",
    "Park",
    "Public Transit",
    "School",
    "Rec./Comm. Centre",
  ];

  const trendData = [
    {
      month: "NOV",
      detached: 450,
      semi: 450,
      townhouse: 480,
      condo: 630,
    },
    {
      month: "DEC",
      detached: 500,
      semi: 500,
      townhouse: 520,
      condo: 570,
    },
    {
      month: "JAN",
      detached: 650,
      semi: 600,
      townhouse: 570,
      condo: 530,
    },
    {
      month: "FEB",
      detached: 850,
      semi: 650,
      townhouse: 600,
      condo: 490,
    },
    {
      month: "MAR",
      detached: 980,
      semi: 700,
      townhouse: 630,
      condo: 460,
    },
    {
      month: "APR",
      detached: 1020,
      semi: 740,
      townhouse: 640,
      condo: 440,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="w-full mx-auto">
        <div className="relative h-[550px] rounded-xl overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
            alt=""
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/55 backdrop-blur-md rounded-2xl p-8 w-[500px] text-center text-white">
              <Lock className="mx-auto mb-4 text-orange-500" size={28} />

              <h1 className="text-4xl font-bold mb-3">
                69 Horseley Hill Drive
              </h1>

              <p className="text-gray-300 text-sm mb-6">
                Local rules require an authorized account to access full
                property details and historical pricing.
              </p>

              <div className="flex justify-center gap-4">
                <button className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-full font-semibold">
                  SIGN IN TO VIEW
                </button>

                <button className="bg-white/10 border border-white/20 px-6 py-3 rounded-full">
                  PHOTO TOGGLE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Property Summary */}
        <div className="bg-white max-w-6xl mx-auto  rounded-2xl shadow-xl -mt-10 relative z-10 px-10 py-8 flex flex-wrap justify-between items-center gap-8">
          <div>
            <h2 className="text-4xl font-bold">69 Horseley Hill Drive</h2>

            <p className="text-gray-500 mt-2">Malvern Elite District</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">$1,250,000</h3>

            <p className="text-xs tracking-[4px] text-gray-500 mt-2">
              LISTING PRICE
            </p>
          </div>

          <div className="flex gap-10">
            <div className="text-center">
              <BedDouble className="mx-auto text-orange-500 mb-2" size={20} />
              <h4 className="font-bold">5</h4>
              <p className="text-xs text-gray-500">BEDS</p>
            </div>

            <div className="text-center">
              <Bath className="mx-auto text-orange-500 mb-2" size={20} />
              <h4 className="font-bold">4</h4>
              <p className="text-xs text-gray-500">BATHS</p>
            </div>

            <div className="text-center">
              <Ruler className="mx-auto text-orange-500 mb-2" size={20} />
              <h4 className="font-bold">3100</h4>
              <p className="text-xs text-gray-500">SQFT</p>
            </div>
          </div>

          <div>
            <span className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold">
              ACTIVE
            </span>
          </div>
        </div>
      </section>
      <div className="bg-[#f5f5f5] min-h-screen pb-20">
        {/* Property Details */}
        <section className="max-w-7xl mx-auto px-4 mt-10">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            {/* Details Card */}
            <div className="bg-[#06132e] rounded-xl p-8 shadow-xl">
              <div className="flex gap-8 border-b border-white/10 pb-4 mb-6">
                <button className="text-orange-400 font-semibold">
                  PROPERTY
                </button>
                <button className="text-white">DETAILS</button>
                <button className="text-white">ROOM SIZES</button>
              </div>

              <div className="grid md:grid-cols-3 gap-8 text-white">
                <div>
                  <p className="text-gray-400 text-sm">MLS ID</p>
                  <p>X13079728</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Property Type</p>
                  <p>Triplex</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p>Active</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Style</p>
                  <p>2 Storey</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Exterior</p>
                  <p>Stucco / Vinyl</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Year Built</p>
                  <p>0-5</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-bold mb-4">Property Features</h3>

              <div className="grid grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="bg-white rounded-lg shadow-sm p-4 text-center text-sm"
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Neighborhood */}
        <section className="max-w-7xl mx-auto px-4 mt-14">
          <h2 className="text-3xl font-bold">Neighborhood Overview</h2>

          <p className="text-gray-500 mt-2">Complete neighborhood profile</p>

          <div className="grid md:grid-cols-3 gap-10 mt-10">
            <ScoreCard
              score="84"
              title="Very Walkable"
              desc="Most errands can be accomplished on foot"
              icon={<Trees size={18} />}
            />

            <ScoreCard
              score="51"
              title="Good Transit"
              desc="A few public transportation options"
              icon={<Bus size={18} />}
            />

            <ScoreCard
              score="58"
              title="Bikeable"
              desc="Some bike infrastructure"
              icon={<Bike size={18} />}
            />
          </div>
        </section>

        {/* Location */}
        <section className="max-w-7xl mx-auto px-4 mt-16">
          <h2 className="text-3xl font-bold mb-8">Location Information</h2>

          <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            {/* Map */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b"
                className="w-full h-[450px] object-cover"
                alt=""
              />
            </div>

            {/* AI Insight */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-orange-500" />
                <h3 className="font-bold text-orange-600">AI Market Insight</h3>
              </div>

              <ul className="space-y-5 text-sm text-gray-700">
                <li>
                  Strong family-oriented neighborhood with growing property
                  value.
                </li>

                <li>
                  Market demand increased significantly compared to previous
                  year.
                </li>

                <li>
                  Excellent location near schools, recreation facilities and
                  public transit.
                </li>
              </ul>

              <button className="mt-8 bg-orange-500 text-white px-5 py-3 rounded-lg w-full">
                View On Map
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center gap-8">
        {/* Left Property Card */}
        <div className="w-[230px] bg-[#02132D] rounded-[18px] shadow-[0_8px_25px_rgba(0,0,0,0.18)] overflow-hidden">
          <div className="p-[8px]">
            <img
              src="/property-1.jpg"
              alt=""
              className="w-full h-[155px] object-cover rounded-[12px]"
            />
          </div>

          <div className="px-4 pb-4">
            <h3 className="text-white text-[34px] font-bold leading-none">
              $749,900
            </h3>

            <p className="text-[#8A93A7] text-[10px] mt-1 leading-relaxed">
              55 Allan Avenue, Homeside, Hamilton
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#8A93A7]">Beds</span>
                <span className="text-white">4</span>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex justify-between text-[11px]">
                <span className="text-[#8A93A7]">Baths</span>
                <span className="text-white">4</span>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex justify-between text-[11px]">
                <span className="text-[#8A93A7]">Size</span>
                <span className="text-white">1,100–1,500 sqft</span>
              </div>
            </div>
          </div>
        </div>

        {/* VS Circle */}
        <div className="w-8 h-8 rounded-full bg-[#F58232] flex items-center justify-center shadow-md shrink-0">
          <span className="text-white text-[11px] font-semibold">VS</span>
        </div>

        {/* Right Comparison Card */}
        <div className="flex-1 bg-[#02132D] rounded-[22px] shadow-[0_8px_25px_rgba(0,0,0,0.18)] p-6">
          {/* Top */}
          <div className="flex justify-between">
            <div>
              <h2 className="text-white text-[34px] font-bold leading-none">
                $825,000
              </h2>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-[#C3C9D5] text-[11px]">
                  44 Venture Avenue
                </span>

                <span className="bg-white/10 text-white text-[10px] px-2 py-1 rounded">
                  1 Km away
                </span>
              </div>
            </div>

            <img
              src="/property-2.jpg"
              alt=""
              className="w-[108px] h-[70px] object-cover rounded-[10px]"
            />
          </div>

          {/* Stats Box */}
          <div className="mt-5 border border-white/15 rounded-[8px] overflow-hidden">
            <div className="grid grid-cols-3">
              <div className="text-center py-4">
                <p className="text-[#B9C0CF] text-[11px]">Beds</p>

                <p className="text-[#F58232] text-[13px] font-semibold mt-2">
                  3
                </p>
              </div>

              <div className="text-center py-4 border-x border-white/10">
                <p className="text-[#B9C0CF] text-[11px]">Baths</p>

                <p className="text-[#F58232] text-[13px] font-semibold mt-2">
                  4
                </p>
              </div>

              <div className="text-center py-4">
                <p className="text-[#B9C0CF] text-[11px]">Size</p>

                <p className="text-[#F58232] text-[13px] font-semibold mt-2">
                  1,100–1,500 sqft
                </p>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="mt-5">
            <h4 className="text-[#F58232] text-[13px] font-semibold flex items-center gap-2">
              ✦ AI Summary
            </h4>

            <ul className="mt-3 space-y-2">
              <li className="text-[#C4CBD8] text-[11px]">
                100 Good offers a better price (-$26k)
              </li>

              <li className="text-[#C4CBD8] text-[11px]">
                100 Good provides one extra bedroom
              </li>

              <li className="text-[#C4CBD8] text-[11px]">
                44 Venture has slightly larger backyard
              </li>
            </ul>
          </div>

          <div className="h-px bg-white/10 my-5" />

          <p className="text-white text-[20px] font-semibold leading-relaxed">
            "100 Good offers stronger overall family value."
          </p>
        </div>
      </div>

      <div className="bg-[#00132D] rounded-[14px] shadow-[0_8px_25px_rgba(0,0,0,0.18)] p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-white text-[32px] font-bold leading-none">
              Malton home prices
            </h2>

            <p className="text-[#F58232] text-[12px] mt-2">
              6-month valuation trend across all asset classes
            </p>
          </div>

          <div className="flex gap-2">
            <button className="h-8 px-3 rounded bg-white text-[11px] font-medium">
              6M
            </button>

            <button className="h-8 px-3 rounded bg-white/10 text-white text-[11px]">
              1Y
            </button>

            <button className="h-8 px-3 rounded bg-white/10 text-white text-[11px]">
              ALL
            </button>
          </div>
        </div>

        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid stroke="#233149" vertical={false} />

              <XAxis
                dataKey="month"
                tick={{
                  fill: "#fff",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: "#fff",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
                domain={[200, 1200]}
                tickFormatter={(v) => `$${v}k`}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="detached"
                stroke="#FF5C5C"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="semi"
                stroke="#20C997"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="townhouse"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="condo"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-8 mt-6">
          <LegendItem color="#FF5C5C" label="DETACHED" />

          <LegendItem color="#20C997" label="SEMI-DETACHED" />

          <LegendItem color="#3B82F6" label="TOWNHOUSE" />

          <LegendItem color="#8B5CF6" label="CONDO APARTMENT" />
        </div>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-[42px] font-bold leading-none">
              Insights for 3067 Churchill Avenue
            </h2>

            <p className="text-[#555] text-[12px] mt-4 max-w-[700px]">
              View the highest and lowest priced active homes, recent sales on
              the same street and postal code, and upcoming open houses this
              weekend.
            </p>
          </div>

          <button className="border border-[#F58232] text-[#F58232] rounded-full px-5 h-10 text-sm flex items-center gap-2">
            <ArrowUpRight size={16} />
            View Full Local Insights
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <PropertyCard />
        <PropertyCard />

        <PropertyCard />
        <PropertyCard />

        <PropertyCard />
        <PropertyCard />
      </div>

      <div className="flex flex-wrap gap-3 mt-8">
        <button className="h-11 px-5 rounded-lg bg-[#FDE7DC] border border-[#F58232] text-[#F58232] text-sm font-medium">
          Sold in Postal Code
        </button>

        <button className="h-11 px-5 rounded-lg bg-white border text-sm">
          Active in Postal Code
        </button>

        <button className="h-11 px-5 rounded-lg bg-white border text-sm">
          Sold on Street
        </button>

        <button className="h-11 px-5 rounded-lg bg-white border text-sm">
          Active on Street
        </button>

        <button className="h-11 px-5 rounded-lg bg-white border text-sm">
          Upcoming Open Houses
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-[42px] font-black uppercase leading-[42px] tracking-[-0.02em] max-w-[500px]">
          SEE WHAT OWNING THIS
          <br />
          HOME ACTUALLY COSTS.
        </h2>
      </div>

      <div className="grid grid-cols-[1fr_0.95fr] gap-6">
        {/* Left Calculator */}
        <div className="bg-white rounded-[18px] shadow-[0_4px_18px_rgba(0,0,0,0.12)] p-6">
          {/* Home Price */}
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-[13px] text-gray-600">Home Price</span>

              <span className="font-semibold text-[15px]">$799,000</span>
            </div>

            <div className="relative h-[3px] bg-[#1F2A44] rounded-full">
              <div className="absolute left-0 top-0 h-full w-[24%] bg-[#F58232]" />
              <div className="absolute left-[24%] -translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F58232]" />
            </div>
          </div>

          <div className="h-px bg-[#D9D9D9] my-6" />

          {/* Down Payment */}

          <div>
            <div className="flex justify-between mb-3">
              <span className="text-[13px] text-gray-600">Down Payment</span>

              <span className="font-semibold text-[15px]">20%</span>
            </div>

            <div className="relative h-[3px] bg-[#1F2A44] rounded-full">
              <div className="absolute left-0 top-0 h-full w-[34%] bg-[#F58232]" />
              <div className="absolute left-[34%] -translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F58232]" />
            </div>
          </div>

          <div className="h-px bg-[#D9D9D9] my-6" />

          {/* Interest */}

          <div>
            <div className="flex justify-between mb-3">
              <span className="text-[13px] text-gray-600">
                Interest Payment
              </span>

              <span className="font-semibold text-[15px]">5.4%</span>
            </div>

            <div className="relative h-[3px] bg-[#1F2A44] rounded-full">
              <div className="absolute left-0 top-0 h-full w-[55%] bg-[#F58232]" />
              <div className="absolute left-[55%] -translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F58232]" />
            </div>
          </div>

          <div className="h-px bg-[#D9D9D9] my-6" />

          {/* Term */}

          <div>
            <div className="flex justify-between mb-3">
              <span className="text-[13px] text-gray-600">Term</span>

              <span className="font-semibold text-[15px]">25 yrs</span>
            </div>

            <div className="relative h-[3px] bg-[#1F2A44] rounded-full">
              <div className="absolute left-0 top-0 h-full w-[55%] bg-[#F58232]" />
              <div className="absolute left-[55%] -translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F58232]" />
            </div>
          </div>
        </div>

        {/* Right Result Card */}

        <div className="bg-[#00132D] rounded-[18px] shadow-[0_4px_18px_rgba(0,0,0,0.18)] p-6">
          <p className="uppercase text-[11px] tracking-[1px] text-gray-400">
            Estimated Monthly
          </p>

          <div className="flex items-end gap-2 mt-1">
            <h3 className="text-white text-[48px] font-bold leading-none">
              $3,887
            </h3>

            <span className="text-gray-400 text-sm mb-1">/MO</span>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Loan amount</span>

              <span className="text-white">$639,200</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Down payment</span>

              <span className="text-white">$159,800</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Property tax (est.)</span>

              <span className="text-white">$402 / mo</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Closing costs (est.)</span>

              <span className="text-white">~$22,000</span>
            </div>
          </div>

          <div className="border border-white/10 rounded-xl mt-6 p-4">
            <p className="text-[#F58232] text-sm font-medium">
              Affordability score
            </p>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-white font-semibold">A-</span>

              <div className="flex-1 h-[5px] bg-white/30 rounded-full overflow-hidden">
                <div className="h-full w-[82%] bg-[#F58232]" />
              </div>
            </div>
          </div>

          <button className="mt-6 h-[52px] rounded-full bg-[#F58232] text-white font-semibold w-full">
            Get pre-approved in 60s
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5 mt-14">
        {[
          {
            icon: "💰",
            title: "Recent Solds",
          },
          {
            icon: "↑",
            title: "Price changes",
          },
          {
            icon: "💲",
            title: "Assignment Sales",
          },
          {
            icon: "🚪",
            title: "Open Houses",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-[#00132D] rounded-[14px] h-[170px] flex flex-col items-center justify-center shadow-[0_4px_18px_rgba(0,0,0,0.18)]"
          >
            <div className="text-[#F58232] text-[42px]">{item.icon}</div>

            <h4 className="text-white text-[28px] font-bold text-center leading-tight mt-4">
              {item.title}
            </h4>

            <p className="text-gray-400 text-sm mt-2">In Hamilton</p>
          </div>
        ))}
      </div>
    </>
  );
}

function ScoreCard({ score, title, desc, icon }) {
  return (
    <div className="flex items-center gap-5">
      <div className="w-20 h-20 rounded-full border-[5px] border-orange-500 flex items-center justify-center text-2xl font-bold bg-white">
        {score}
      </div>

      <div>
        <div className="flex items-center gap-2 font-bold">
          {icon}
          {title}
        </div>

        <p className="text-gray-500 text-sm mt-1">{desc}</p>
      </div>
    </div>
  );
}

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full" style={{ background: color }} />
    <span className="text-white text-[11px] tracking-wide">{label}</span>
  </div>
);

const PropertyCard = () => {
  return (
    <>
      <div className="bg-[#00132D] rounded-xl overflow-hidden shadow-md flex">
        <img
          src="/house.jpg"
          alt=""
          className="w-[170px] h-[110px] object-cover"
        />

        <div className="p-4 flex-1">
          <p className="text-white text-sm">80 Goode Street</p>

          <h3 className="text-[#F58232] text-[28px] font-bold leading-none mt-2">
            $888,000
          </h3>

          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="bg-white rounded-full px-2 py-1 text-[10px] flex items-center gap-1">
              <BedDouble size={10} />4
            </span>

            <span className="bg-white rounded-full px-2 py-1 text-[10px] flex items-center gap-1">
              <Bath size={10} />2
            </span>

            <span className="bg-white rounded-full px-2 py-1 text-[10px] flex items-center gap-1">
              <Ruler size={10} />
              1100-1500 sqft
            </span>
          </div>

          <div className="mt-3">
            <span className="bg-[#2F5138] text-[#7AFFA5] text-[10px] px-3 py-1 rounded-full">
              Active
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
