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
    <section className="bg-[#F7F8FA] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-4 py-2 text-sm font-medium text-[#F97316]">
            Real Estate Solutions
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            What are you looking for?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6B7280] sm:text-base">
            Whether you're buying, renting, investing, or selling, LISTO helps
            you move forward with confidence.
          </p>
        </div>

        <div className="mt-14 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group flex min-h-[430px] flex-col rounded-[32px] border border-[#E5E7EB] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:border-[#F97316]/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            >
              <div className="flex justify-center">
                <div className="flex h-[190px] w-full items-center justify-center rounded-[28px] bg-[#FFF7ED]">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={card.image}
                    alt={card.title}
                    className="h-[145px] w-auto object-contain"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-1 flex-col text-center">
                <h3 className="text-2xl font-bold text-[#111827]">
                  {card.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-[#6B7280]">
                  {card.description}
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 h-12 rounded-2xl border border-[#F97316] text-sm font-semibold text-[#F97316] transition-all hover:bg-[#F97316] hover:text-white"
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
