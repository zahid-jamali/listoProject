const services = [
  {
    title: "Property Management",
    items: [
      "Rental Property Maintenance",
      "24/7 Support",
      "Rent Collection Services",
      "Comprehensive Financial Reporting",
      "Online Access Portals",
      "Lease Renewal Management",
      "Move-In Inspections",
      "Tenant Communication",
      "Insurance Claim Services",
    ],
  },
  {
    title: "Tenant Placement",
    items: [
      "Property Inspection",
      "Staging",
      "Credit Check",
      "Tenant Screening",
      "Photo and Video Tour",
      "Move-In Inspection",
      "Lease Creation",
      "Utility Transfer Assistance",
      "Tenant Insurance",
    ],
  },
  {
    title: "Rental Guarantee",
    items: [
      "Rent Guarantee",
      "Tenant Replacement",
      "Insurance Claiming",
      "Loss of Rent Recovery",
      "Mortgage Payment Coverage",
      "AI Applications",
      "LTR Training",
      "Radio Advertising",
    ],
  },
];

export default function PropertyManagementPage() {
  return (
    <main className="bg-[#F4F4F4] ">
      <HeroSection />
      <ServicesSection />
      <OntarioSection />
      <BottomCTA />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative h-[520px] overflow-hidden">
      <img
        src="/assets/p-m-1.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover pt-"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 p-20 flex h-full items-center justify-center px-6">
        <div className="max-w-4xl text-center text-white">
          <h1 className="text-5xl font-black">Property Management</h1>

          <p className="mt-4 text-[#F58233] font-semibold">
            Our local teams manage your property and tenants with care.
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-[15px] leading-7 text-gray-200">
            Listo provides property management solutions that eliminate property
            hassles and owners can simply earn returns without stress.
          </p>

          <p className="mx-auto mt-3 max-w-3xl text-[15px] leading-7 text-gray-300">
            Enjoy worry-free property management and ownership through
            transparent service and experienced professionals.
          </p>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-black text-[#02132D]">Our Services</h2>

          <p className="mt-4 text-gray-500">
            Listo works tirelessly to simplify real estate investing by
            providing consistent income and reducing hassles.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl bg-[#02132D] p-8 text-white shadow-xl"
            >
              <div className="mb-5 h-14 w-14 rounded-xl bg-[#F58233]/20 flex items-center justify-center">
                <span className="text-3xl">🏠</span>
              </div>

              <h3 className="text-2xl font-bold">{service.title}</h3>

              <ul className="mt-6 space-y-3">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-300"
                  >
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#F58233]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OntarioSection() {
  const features = [
    "Move-In Inspection",
    "Rent Collection",
    "Scheduled Showings",
    "Photo / Video Tour",
    "Tenant Screening",
    "Property Evaluation",
  ];

  return (
    <section className="bg-[#F4F4F4] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* IMAGE */}

          <div>
            <img
              src="/assets/p-m-2.png"
              alt=""
              className="h-[420px] w-full rounded-3xl object-cover shadow-xl"
            />
          </div>

          {/* CONTENT */}

          <div>
            <h2 className="text-5xl font-black text-[#02132D]">
              Ontario is our home
            </h2>

            <p className="mt-5 text-gray-600 leading-8">
              Our local team in Ontario is dedicated to helping you maximize
              your rental investment while safeguarding your assets.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-xl border bg-white p-4 text-center font-medium shadow-sm"
                >
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-full bg-[#F58233] px-6 py-3 font-semibold text-white">
                Get In Touch
              </button>

              <button className="rounded-full bg-[#02132D] px-6 py-3 font-semibold text-white">
                Investment Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-[28px] bg-[#02132D] px-10 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <h2 className="text-4xl font-black text-white">
            More time for yourself and less stress as your wealth grows 🏡
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-gray-300">
            Let our experienced property management team handle maintenance,
            tenant relations, inspections, rent collection, and reporting while
            you focus on growing your portfolio.
          </p>

          <button className="mt-8 rounded-full bg-[#F58233] px-8 py-3 font-semibold text-white">
            Schedule a Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
