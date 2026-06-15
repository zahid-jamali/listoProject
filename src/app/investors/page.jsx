"use client";

import { motion } from "framer-motion";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const cities = [
  { name: "Toronto", count: 1107, href: "toronto" },
  { name: "Dubai", count: 847, href: "dubai" },
  { name: "New York", count: 532, href: "york" },
  { name: "London", count: 420, href: "london" },
];

export default function InvestorListings() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  return (
    <section className="bg-[#F7F8FA] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-4 py-2 text-sm font-medium text-[#F97316]">
            Investors & Developers
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            Listings For Investors & Developers
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#6B7280] sm:text-base">
            Discover high-potential opportunities using LISTO's proprietary
            market intelligence. Compare listings against historical sales,
            lot-size benchmarks and investment metrics.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-14 max-w-3xl rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.05)] lg:p-10"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#111827] lg:text-3xl">
              View Investment Listings
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#6B7280]">
              Select a market and instantly discover curated opportunities for
              investors, developers and land acquisition strategies.
            </p>
          </div>

          <div className="relative mt-8">
            <select
              value={selectedCity.name}
              onChange={(e) => {
                const city = cities.find(
                  (item) => item.name === e.target.value,
                );
                setSelectedCity(city);
              }}
              className="h-14 w-full appearance-none rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 pr-14 text-sm font-semibold text-[#111827] outline-none transition-all focus:border-[#F97316] focus:bg-white"
            >
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name} ({city.count})
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />
          </div>

          <div className="mt-8 flex justify-center">
            <Link href={`/investors/${selectedCity.href}`}>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-2xl bg-[#081A3A] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#102752]"
              >
                View Opportunities
                <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] px-4 py-3">
            <Sparkles size={14} className="text-[#F97316]" />

            <p className="text-sm font-medium text-[#F97316]">
              Compare listings against minimum and maximum sold prices by lot
              size.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
