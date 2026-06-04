"use client";

import { motion } from "framer-motion";
import { Sparkles, Search } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay,
    },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[760px] overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/hero.png')",
        }}
      />

      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md"
        >
          <Sparkles size={13} className="text-[#F97316]" />
          <span className="text-xs font-medium tracking-wide text-white sm:text-sm">
            AI Powered Real Estate Discovery
          </span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.1}
          className="max-w-4xl font-bold tracking-tight text-white text-2xl  sm:text-3xl md:text-5xl"
        >
          Find your next home in <span className="text-[#F97316]">Canada.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.2}
          className="mt-5 max-w-2xl text-sm leading-7 text-white/85 sm:text-base lg:text-lg"
        >
          Explore MLS listings, pre-construction opportunities, condos,
          buildings and investment properties with intelligent search.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.3}
          className="mt-10 w-full max-w-[700px] rounded-[32px] border border-white/10 bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center rounded-full bg-[#F7F8FA] p-1">
              <button className="rounded-full bg-[#F97316] px-4 py-2 text-xs font-semibold text-white sm:px-5 sm:text-sm">
                Residential
              </button>

              <button className="px-4 py-2 text-xs font-medium text-[#6B7280] transition-colors hover:text-[#111827] sm:text-sm">
                Commercial
              </button>
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2 text-xs font-semibold text-[#F97316] sm:px-4 sm:text-sm"
            >
              <Sparkles size={14} />
              AI Search
            </motion.button>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div className="flex h-14 flex-1 items-center rounded-2xl border border-[#E5E7EB] px-4 transition-all focus-within:border-[#F97316]">
              <Search size={18} className="text-[#9CA3AF]" />

              <input
                type="text"
                placeholder="Search homes, condos, neighborhoods..."
                className="w-full bg-transparent px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
              />
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="h-14 rounded-2xl bg-[#081A3A] px-6 text-sm font-semibold text-white transition-all hover:bg-[#102752]"
            >
              Search
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
