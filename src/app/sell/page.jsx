"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, BadgeDollarSign } from "lucide-react";

const reasons = [
  {
    title: "Expand Your Reach",
    description:
      "Reach more qualified buyers through LISTO's growing ecosystem of resale, pre-construction and investor traffic.",
    icon: Users,
  },
  {
    title: "Trusted Local Experts",
    description:
      "Work with experienced agents who understand pricing strategy, negotiation and market positioning.",
    icon: TrendingUp,
  },
  {
    title: "Lower Fees, Higher Returns",
    description:
      "Maximize your sale price while reducing unnecessary brokerage expenses and marketing costs.",
    icon: BadgeDollarSign,
  },
];

export default function SellPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <section className="relative overflow-hidden bg-[#081A3A]">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-[-100px] top-[-100px] h-[280px] w-[280px] sm:h-[400px] sm:w-[400px] rounded-full bg-[#F97316]/20 blur-[120px]" />
          <div className="absolute right-[-100px] top-[50px] h-[280px] w-[280px] sm:h-[400px] sm:w-[400px] rounded-full bg-blue-500/20 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-14 sm:py-20 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center lg:text-left"
            >
              <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-white backdrop-blur-md">
                Sell With Confidence
              </span>

              <h1 className="mt-5 font-bold tracking-tight text-white text-2xl sm:text-3xl md:text-5xl leading-tight">
                Sell With
                <span className="block text-[#F97316]">LISTO</span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm sm:text-base leading-7 sm:leading-8 text-white/75 lg:mx-0">
                Maximize your property's value with expert pricing, premium
                marketing and a modern selling experience designed to reduce
                fees and increase exposure.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button className="rounded-2xl bg-[#F97316] px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1">
                  Start Selling
                </button>

                <button className="rounded-2xl border border-white/15 bg-white/10 px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-semibold text-white backdrop-blur-md">
                  Learn More
                </button>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl"
            >
              <img
                src="/assets/sold.png"
                alt="Sell With Listo"
                className="
            w-full
            h-[260px]
            sm:h-[380px]
            md:h-[450px]
            lg:h-[520px]
            object-cover
          "
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-4 py-2 text-sm font-medium text-[#F97316]">
              Why Choose LISTO
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
              3 Reasons To Sell With LISTO
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6B7280] sm:text-base">
              A modern real-estate platform built to help sellers achieve better
              results with less friction.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;

              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF7ED]">
                    <Icon className="text-[#F97316]" size={28} />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-[#111827]">
                    {reason.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                    {reason.description}
                  </p>

                  <button className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#081A3A]">
                    Learn More
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
