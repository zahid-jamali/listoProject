"use client";

import { motion } from "framer-motion";

const cards = [
  {
    title: "Buy",
    description:
      "Browse live MLS listings across the GTA and get matched with a LISTO advisor who knows your neighbourhood.",
    button: "Start your search",
    image: "/assets/buy.png",
  },
  {
    title: "Rent",
    description:
      "Verified condo, house and basement rentals — updated daily with transparent pricing.",
    button: "Browse rentals",
    image: "/assets/rent.png",
  },
  {
    title: "Pre-Construction",
    description:
      "Platinum-access pricing on upcoming towers, towns and detached projects before public release.",
    button: "View launches",
    image: "/assets/preconstruction.png",
  },
  {
    title: "Sell",
    description:
      "Professional marketing, pricing intelligence and local expertise to maximize value.",
    button: "Get home value",
    image: "/assets/sell.png",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
    },
  }),
};

export default function PropertyCards() {
  return (
    <section className="bg-[#F7F8FA] py-14 relative z-0  sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-3 py-1.5 text-xs font-medium text-[#F97316] sm:px-4 sm:py-2 sm:text-sm">
            Real Estate Solutions
          </span>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl lg:text-4xl xl:text-5xl">
            What are you looking for?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6B7280] sm:text-base">
            Whether you're buying, renting, investing, or selling, LISTO helps
            you move forward with confidence.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="
                group flex flex-col
                rounded-[24px] lg:rounded-[32px]
                border border-[#E5E7EB]
                bg-white
                p-4 sm:p-5 lg:p-6
                shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                transition-all
                hover:border-[#F97316]/30
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]
              "
            >
              {/* Image */}
              <div className="flex justify-center">
                <div
                  className="
                    flex w-full items-center justify-center
                    rounded-[20px] lg:rounded-[28px]
                    bg-[#FFF7ED]
                    h-[150px]
                    sm:h-[170px]
                    lg:h-[190px]
                  "
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={card.image}
                    alt={card.title}
                    className="
                      h-[100px]
                      sm:h-[120px]
                      lg:h-[145px]
                      w-auto object-contain
                    "
                  />
                </div>
              </div>

              {/* Content */}
              <div className="mt-5 flex flex-1 flex-col text-center">
                <h3 className="text-xl font-bold text-[#111827] sm:text-2xl">
                  {card.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-[#6B7280] sm:mt-4 sm:leading-7">
                  {card.description}
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    mt-5
                    h-11 sm:h-12
                    w-full
                    rounded-xl sm:rounded-2xl
                    border border-[#F97316]
                    text-sm font-semibold
                    text-[#F97316]
                    transition-all
                    hover:bg-[#F97316]
                    hover:text-white
                  "
                >
                  {card.button}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
