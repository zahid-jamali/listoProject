"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const cities = [
  {
    name: "Toronto",
    listings: "12,400+",
    image: "/assets/toronto.png",
    bg: "bg-[#F6EEE3]",
  },
  {
    name: "Vaughan",
    listings: "3,200+",
    image: "/assets/vaughan.png",
    bg: "bg-[#F8F1D9]",
  },
  {
    name: "Brampton",
    listings: "8,100+",
    image: "/assets/brampton.png",
    bg: "bg-[#E8F2FA]",
  },
  {
    name: "Markham",
    listings: "5,600+",
    image: "/assets/markham.png",
    bg: "bg-[#E8F0FA]",
  },
  {
    name: "Stouffville",
    listings: "2,900+",
    image: "/assets/stouffville.png",
    bg: "bg-[#F9E9EC]",
  },
  {
    name: "Ajax",
    listings: "4,100+",
    image: "/assets/ajax.png",
    bg: "bg-[#E6F6EE]",
  },
  {
    name: "Mississauga",
    listings: "4,100+",
    image: "/assets/mississauga.png",
    bg: "bg-[#57D6E8]",
  },
  {
    name: "Oakville",
    listings: "4,100+",
    image: "/assets/oakville.png",
    bg: "bg-[#8D96F0]",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.04,
    },
  }),
};

export default function PopularCities() {
  return (
    <section className="bg-[#F7F8FA] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-4 py-2 text-sm font-medium text-[#F97316]">
              Explore Locations
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
              Popular Cities
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6B7280] sm:text-base">
              Discover homes, condos, rentals and investment opportunities
              across Canada's most active real estate markets.
            </p>
          </div>

          <Link
            href="/cities"
            className="hidden items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition-all hover:border-[#F97316] hover:text-[#F97316] md:flex"
          >
            View All Cities
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-5 grid-cols-2 sm:grid-cols-4 md:grid-cols-8">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Link
                href={`/city/${city.name.toLowerCase()}`}
                className="group block"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`flex h-[120px] w-[120px] items-center justify-center rounded-[28px] border border-[#E5E7EB] shadow-[0_8px_25px_rgba(0,0,0,0.04)] transition-all group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] ${city.bg}`}
                  >
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      src={city.image}
                      alt={city.name}
                      className="h-[54px] w-auto object-contain"
                    />
                  </motion.div>

                  <h3 className="mt-4 text-base font-bold text-[#111827] transition-colors group-hover:text-[#F97316]">
                    {city.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#6B7280]">{city.listings}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/cities"
            className="rounded-2xl border border-[#F97316] px-6 py-3 text-sm font-semibold text-[#F97316]"
          >
            View All Cities
          </Link>
        </div>
      </div>
    </section>
  );
}
