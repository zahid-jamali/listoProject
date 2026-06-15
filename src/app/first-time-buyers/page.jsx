"use client";

import {
  ShieldCheck,
  Landmark,
  HeartHandshake,
  BadgeDollarSign,
  Wallet,
} from "lucide-react";

import { CreditCard, Building2, SearchCheck } from "lucide-react";

import { Star } from "lucide-react";

export default function FirstTimeBuyerPage() {
  const programs = [
    {
      icon: Landmark,
      amount: "$4,000",
      title: "Land Transfer Tax Rebate",
      description:
        "First-time buyers can receive a refund of up to $4,000 on the provincial land transfer tax.",
      points: ["Automatic calculation at closing", "Max rebate value: $4,000"],
    },
    {
      icon: HeartHandshake,
      amount: "$35,000",
      title: "RRSP Home Buyers’ Plan (HBP)",
      description:
        "Withdraw up to $35,000 from your RRSP tax-free to put towards your down payment.",
      points: [
        "Repayment starts after 2 years",
        "Tax-free withdrawal for home purchase",
      ],
    },
    {
      icon: BadgeDollarSign,
      amount: "5–10%",
      title: "Shared Equity Incentive",
      description:
        "Government shares a portion of your mortgage, helping reduce monthly costs.",
      points: ["Lower monthly mortgage payments", "No interest charged"],
    },
    {
      icon: Wallet,
      amount: "$40,000",
      title: "FHSA Account",
      description:
        "Contribute up to $8,000 annually and withdraw funds tax-free for your first home.",
      points: ["Tax-free growth", "Tax-deductible contributions"],
    },
  ];

  const steps = [
    {
      title: "1. Pre-Approval",
      description:
        "Get a written commitment from a lender determining how much you can borrow. This locks in your interest rate.",
    },
    {
      title: "2. Find Your Home",
      description:
        "Work with a real estate professional to search for properties within your pre-approved budget.",
    },
    {
      title: "3. Final Approval",
      description:
        "Once an offer is accepted, the lender performs a final review of your financial documents.",
    },
    {
      title: "4. Closing Day",
      description:
        "Your lawyer handles ownership transfer, closing costs and key handover.",
    },
  ];

  const tips = [
    {
      icon: CreditCard,
      title: "Save Beyond the Down Payment",
      desc: "Remember to budget for closing costs, moving expenses and maintenance.",
    },
    {
      icon: Building2,
      title: "Watch Your Credit Score",
      desc: "A strong credit score improves mortgage approval chances and interest rates.",
    },
    {
      icon: SearchCheck,
      title: "Get a Home Inspection",
      desc: "Professional inspections help identify structural issues before purchase.",
    },
  ];
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "First-Time Homeowner",
      text: "This guide made a terrifying process feel completely manageable. The rebate information alone saved us thousands.",
    },
    {
      name: "David Chen",
      role: "Toronto Buyer",
      text: "Clear, concise, and incredibly helpful. The step-by-step mortgage process was exactly what I needed.",
    },
  ];

  return (
    <main className="bg-[#f4f4f4] min-h-screen">
      {/* HERO */}
      <section className="bg-[#ececec]">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <span className="inline-flex rounded-full bg-[#F58233] px-3 py-1 text-[11px] font-semibold text-white">
                Expert Guide 2025
              </span>

              <h1 className="mt-5 text-[52px] leading-[58px] font-extrabold tracking-[-2px] text-[#111827]">
                Ontario First-Time Home Buyer Guide (2025)
              </h1>

              <p className="mt-5 max-w-xl text-[16px] leading-8 text-[#6B7280]">
                Everything you need to navigate the Ontario real estate market,
                from eligibility requirements to mortgage approvals and closing
                costs.
              </p>

              <button className="mt-8 h-[52px] px-8 rounded-full bg-[#00112B] text-white font-semibold hover:opacity-90 transition">
                Get Started
              </button>
            </div>

            {/* Right */}
            <div className="relative">
              <img
                src="/assets/first-time.png"
                alt=""
                className="w-full rounded-2xl object-cover shadow-[0_15px_40px_rgba(0,0,0,0.18)]"
              />

              <div className="absolute left-[-25px] bottom-[25px] bg-white rounded-xl px-5 py-4 shadow-xl">
                <p className="text-[10px] uppercase text-gray-500">
                  Current Rates
                </p>

                <h4 className="text-[24px] font-bold text-[#111827]">4.85%</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUALIFICATION */}
      <section className="py-20">
        <div className="max-w-[760px] mx-auto px-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-10 py-14 text-center">
            <ShieldCheck size={32} className="mx-auto text-[#00112B]" />

            <h2 className="mt-5 text-[30px] font-bold text-[#111827]">
              Who Qualifies as a First-Time Buyer?
            </h2>

            <p className="mt-6 text-[15px] leading-8 text-gray-600">
              To be eligible for most Ontario programs, you must be a Canadian
              citizen or permanent resident, at least 18 years of age, and have
              never owned a home anywhere in the world. If purchasing with a
              partner, additional criteria may apply.
            </p>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[38px] font-bold text-[#111827]">
            Ontario Programs & Rebates
          </h2>

          <p className="mt-3 text-gray-500">
            Incentives designed to make homeownership more accessible in
            Ontario.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {programs.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="bg-[#00112B] text-white rounded-2xl p-7 shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <Icon size={20} />

                    <span className="text-[20px] font-bold">{item.amount}</span>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>

                  <p className="mt-4 text-[14px] leading-7 text-gray-300">
                    {item.description}
                  </p>

                  <ul className="mt-6 space-y-2">
                    {item.points.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <span>✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#00112B] py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-white text-4xl font-bold">
            Ready to Start Your Home Buying Journey?
          </h2>

          <div className="mt-4 text-gray-300 space-y-2">
            <p>"What Can I Get for $800K in Toronto?"</p>
            <p>"Where can I find a Detached Home under $900K?"</p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button className="h-12 px-7 rounded-full bg-[#F58233] text-white font-semibold hover:opacity-90">
              Get Expert Consultation
            </button>

            <button className="h-12 px-7 rounded-full border border-[#F58233] text-[#F58233] hover:bg-[#F58233] hover:text-white transition">
              Browse Listings for New Buyers
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#F4F4F4] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#0F172A]">
              Tips for First-Time Buyers
            </h2>

            <p className="mt-3 text-gray-500">
              Expert advice to ensure a smooth purchasing experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {tips.map((tip, index) => {
              const Icon = tip.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 p-7 hover:shadow-xl transition"
                >
                  <Icon className="text-[#00112B]" />

                  <h3 className="mt-5 font-bold text-lg">{tip.title}</h3>

                  <p className="mt-3 text-gray-600 leading-7">{tip.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F4F4F4] pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#0F172A]">
              What Our Clients Say
            </h2>

            <p className="mt-3 text-gray-500">
              Join thousands of Ontarians who used our guide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-14">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl transition"
              >
                <div className="flex gap-1 text-[#F58233]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="mt-5 text-gray-700 leading-8 italic">
                  "{item.text}"
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#00112B] text-white flex items-center justify-center font-bold">
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <div className="font-semibold">{item.name}</div>

                    <div className="text-sm text-gray-500">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
