"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

export default function PreConstructionSection() {
  const projects = [
    {
      city: "Dubai",
      address: "311 / 2 Gardie Avenue N, Homeside, Hamilton",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
      price: "$650,000",
      completion: "Q4 2026",
      href: "Dubai",
    },
    {
      city: "Toronto",
      address: "311 / 2 Gardie Avenue N, Homeside, Hamilton",
      image:
        "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1200&auto=format&fit=crop",
      price: "$650,000",
      completion: "Q4 2026",
      href: "Toronto",
    },
    {
      city: "New York",
      address: "311 / 2 Gardie Avenue N, Homeside, Hamilton",
      image:
        "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=1200&auto=format&fit=crop",
      price: "$650,000",
      completion: "Q4 2026",
      href: "York",
    },
    {
      city: "Durham",
      address: "311 / 2 Gardie Avenue N, Homeside, Hamilton",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
      price: "$650,000",
      completion: "Q4 2026",
      href: "Durham",
    },
    {
      city: "Peel",
      address: "311 / 2 Gardie Avenue N, Homeside, Hamilton",
      image:
        "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop",
      price: "$650,000",
      completion: "Q4 2026",
      href: "Peel",
    },
    {
      city: "Halton",
      address: "311 / 2 Gardie Avenue N, Homeside, Hamilton",
      image:
        "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1200&auto=format&fit=crop",
      price: "$800,000",
      completion: "Q4 2026",
      href: "Halton",
    },
  ];

  const stats = [
    { value: "500+", label: "Active Projects" },
    { value: "12", label: "Global Cities" },
    { value: "$4.2B", label: "Assets Sold" },
    { value: "15k", label: "Verified Investors" },
  ];

  const features = [
    {
      title: "Lower Entry Prices",
      desc: "Secure inventory before market delivery and benefit from future appreciation.",
      icon: "/assets/icons/pc-1.png",
    },
    {
      title: "Flexible Plans",
      desc: "Structured deposit schedules designed to reduce upfront investment pressure.",
      icon: "/assets/icons/pc-2.png",
    },
    {
      title: "High ROI Potential",
      desc: "Historically strong equity growth during development and completion phases.",
      icon: "/assets/icons/pc-3.png",
    },
    {
      title: "Brand New Homes",
      desc: "Modern finishes, warranties and lower maintenance costs from day one.",
      icon: "/assets/icons/pc-4.png",
    },
  ];

  return (
    <section className="bg-[#F7F8FA] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-4 py-2 text-sm font-medium text-[#F97316]">
            Platinum Access Projects
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            Pre‑Construction Projects
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#6B7280] sm:text-base">
            Discover exclusive developer inventory, early pricing advantages and
            high-growth investment opportunities across leading markets.
          </p>
        </div>

        <div className="mt-14 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.city}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ y: -6 }}
            >
              <Link href={`/preconstruction/${project.href}`}>
                <div className="overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.10)]">
                  <div className="relative h-[260px] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.city}
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#111827]">
                      {project.city}
                    </h3>

                    <div className="mt-3 flex items-start gap-2">
                      <MapPin size={16} className="mt-1 text-[#9CA3AF]" />
                      <p className="text-sm leading-6 text-[#6B7280]">
                        {project.address}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#F3F4F6] pt-5">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#9CA3AF]">
                          Starting From
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#F97316]">
                          {project.price}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wider text-[#9CA3AF]">
                          Completion
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#111827]">
                          {project.completion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="rounded-2xl bg-[#081A3A] px-7 py-3 text-sm font-semibold text-white hover:bg-[#102752]">
            Browse by Developer
          </button>
        </div>
      </div>

      <div className="mt-20 bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label}>
              <h3 className="text-4xl font-bold text-[#111827]">
                {item.value}
              </h3>
              <p className="mt-2 text-sm text-[#6B7280]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            Why Invest In Pre‑Construction?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6B7280] sm:text-base">
            A smarter way to build long‑term wealth through real estate.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="rounded-[32px] border border-[#E5E7EB] bg-white p-8 text-center shadow-[0_10px_35px_rgba(0,0,0,0.05)]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9ad4b]">
                <img
                  src={feature.icon}
                  alt=""
                  className="h-8 w-8 object-contain"
                />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#111827]">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
