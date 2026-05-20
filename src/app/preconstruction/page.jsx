export default function PreConstructionSection() {
  const projects = [
    {
      city: "Dubai",
      address: "311 / 2 Gardie Avenue N, Homeside, Hamilton",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
      price: "$650,000",
      completion: "Q4 2026",
    },
    {
      city: "Toronto",
      address: "311 / 2 Gardie Avenue N, Homeside, Hamilton",
      image:
        "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1200&auto=format&fit=crop",
      price: "$650,000",
      completion: "Q4 2026",
    },
    {
      city: "New York",
      address: "311 / 2 Gardie Avenue N, Homeside, Hamilton",
      image:
        "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=1200&auto=format&fit=crop",
      price: "$650,000",
      completion: "Q4 2026",
    },
    {
      city: "Durham",
      address: "311 / 2 Gardie Avenue N, Homeside, Hamilton",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
      price: "$650,000",
      completion: "Q4 2026",
    },
    {
      city: "Peel",
      address: "311 / 2 Gardie Avenue N, Homeside, Hamilton",
      image:
        "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop",
      price: "$650,000",
      completion: "Q4 2026",
    },
    {
      city: "Halton",
      address: "311 / 2 Gardie Avenue N, Homeside, Hamilton",
      image:
        "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1200&auto=format&fit=crop",
      price: "$800,000",
      completion: "Q4 2026",
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
      title: "Lower entry prices",
      desc: "Lock in current market value and benefit from appreciation before the doors even open.",
      icon: "/assets/icons/pc-1.png",
    },
    {
      title: "Flexible plans",
      desc: "Spread your deposit over several years with manageable, structured payment installments.",
      icon: "/assets/icons/pc-2.png",
    },
    {
      title: "High ROI",
      desc: "Historically outperform traditional listings through rapid equity growth during construction.",
      icon: "/assets/icons/pc-3.png",
    },
    {
      title: "Brand new",
      desc: "Receive a turnkey property with full warranties, modern standards, and zero maintenance costs.",
      icon: "/assets/icons/pc-4.png",
    },
  ];

  return (
    <section className="w-full bg-[#f5f5f5] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full  shadow-sm">
                <img
                  src="/assets/icons/pc-headings.png"
                  className="rounded-4xl"
                />
              </div>

              <div>
                <h2 className="text-[28px] font-bold tracking-[-0.03em] text-[#111827] sm:text-[34px]">
                  Pre-Construction Projects
                </h2>
              </div>
            </div>

            {/* <button className="rounded-full border border-[#d6d6d6] bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[#4b5563] shadow-sm transition-all duration-300 hover:border-[#ff6b2c] hover:text-[#ff6b2c]">
              Map
            </button> */}
          </div>

          <div className="max-w-5xl rounded-2xl border border-[#dcdcdc] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <p className="text-sm leading-7 text-[#4b5563]  sm:text-[15px]">
              Discover a curated portfolio of pre-construction opportunities on
              Listo, where we collaborate directly with developers to offer
              exclusive access to high-growth investment projects. Gain market
              insights, premium inventory, and early-stage pricing advantages
              designed for modern real estate investors.
            </p>
          </div>
        </div>

        {/* PROJECT GRID */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-[24px] border border-[#d9d9d9] bg-white shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
            >
              <div className="relative h-[250px] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.city}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/20 to-transparent" />
              </div>

              <div className="bg-[#04122b] px-5 py-5 text-white">
                <div className="mb-5">
                  <h3 className="text-[26px] font-bold tracking-[-0.03em]">
                    {project.city}
                  </h3>

                  <div className="mt-2 flex items-start gap-2 text-[13px] text-[#cbd5e1]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="mt-[1px] h-4 w-4 flex-shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>

                    <span className="leading-5">{project.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
                      Starting From
                    </p>
                    <p className="mt-1 text-lg font-bold text-[#ff7b3d]">
                      {project.price}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
                      Completion
                    </p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {project.completion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="mt-10 flex justify-center">
          <button className="rounded-full bg-[#ff6b2c] px-7 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_12px_25px_rgba(255,107,44,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#ff5a14]">
            Browse by Developer →
          </button>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="mt-20 bg-[#ececec] py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-4 text-center md:grid-cols-4">
          {stats.map((item, index) => (
            <div key={index}>
              <h3 className="text-4xl font-extrabold tracking-[-0.04em] text-[#0f172a] sm:text-5xl">
                {item.value}
              </h3>

              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* WHY INVEST */}
      <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-[34px] font-bold tracking-[-0.04em] text-[#111827]">
            Why Invest in Pre-Construction?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[#6b7280]">
            Secure your future with the most strategic real estate acquisition
            model available today.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-[24px] bg-[#03112b] p-8 text-center shadow-[0_15px_40px_rgba(2,6,23,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(2,6,23,0.2)]"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ff6b2c] text-xl font-bold text-white shadow-lg shadow-[#ff6b2c]/30">
                <img src={feature.icon} />
              </div>

              <h3 className="mt-7 text-[22px] font-bold tracking-[-0.03em] text-white">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#cbd5e1]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
