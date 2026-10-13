"use client";

import { motion } from "framer-motion";
import GlobalSearch from "../GlobalSearch";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay,
    },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[320px] overflow-hidden md:min-h-[48vh] lg:min-h-[52vh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero.png')" }}
      />
      <div className="absolute inset-0 bg-[#04122B]/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#04122B]/90 via-[#04122B]/55 to-[#04122B]/35" />

      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-7xl items-center px-5 pb-10 pt-28 md:min-h-[48vh] md:px-8 md:pb-14 md:pt-32 lg:min-h-[52vh] lg:px-10">
        <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* LEFT — copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="max-w-xl text-left"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F36B22]">
              Listo.ca
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Find your next home in Canada.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
              Search live MLS listings, pre-construction projects, and
              investment properties across Ontario.
            </p>
          </motion.div>

          {/* RIGHT — search */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.12}
            className="w-full lg:justify-self-end"
          >
            <div className="w-full rounded-2xl border border-white/15 bg-white/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-5">
              <p className="mb-3 text-sm font-semibold text-[#0B132B]">
                Search properties
              </p>
              <GlobalSearch />
              <p className="mt-3 text-xs text-slate-500">
                Try a city, neighborhood, building, or MLS number.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
