import {
  Building2,
  Landmark,
  Scale,
  ShieldCheck,
  PaintBucket,
  BadgeDollarSign,
} from "lucide-react";
import Link from "next/link";

const categories = [
  "Builders",
  "Mortgage Agents",
  "Real Estate Lawyers",
  "Home Inspectors",
  "Interior Designers & Stagers",
  "Insurance Agents",
];

const services = [
  {
    title: "Builders",
    image: "/assets/ad-1.png",
    description:
      "Showcase your property developments to serious buyers and investors.",
    bullets: [
      "Feature New Builds",
      "Boost Project Visibility",
      "Generate Qualified Leads",
    ],
  },
  {
    title: "Mortgage Agents",
    image: "/assets/ad-2.png",
    description:
      "Connect with homebuyers actively searching for financing solutions.",
    bullets: [
      "Location Based Ads",
      "Lead Generation",
      "Promote Mortgage Rates",
    ],
  },
  {
    title: "Real Estate Lawyers",
    image: "/assets/ad-3.png",
    description:
      "Position your legal services in front of active real estate clients.",
    bullets: ["Connect With Clients", "Build Trust", "Increase Visibility"],
  },
  {
    title: "Home Inspectors",
    image: "/assets/ad-4.png",
    description: "Reach buyers who require professional inspections.",
    bullets: [
      "Gain Targeted Exposure",
      "Build Credibility",
      "Highlight Certifications",
    ],
  },
  {
    title: "Interior Designers & Stagers",
    image: "/assets/ad-5.png",
    description: "Present your design portfolio to homeowners and investors.",
    bullets: ["Showcase Portfolio", "Gain New Projects", "Attract Attention"],
  },
  {
    title: "Insurance Agents",
    image: "/assets/ad-6.png",
    description: "Promote insurance products to homebuyers and investors.",
    bullets: [
      "Build Connections",
      "Increase Coverage Sales",
      "Generate Referrals",
    ],
  },
];

export default function AdvertisePage() {
  return (
    <main className="bg-[#F5F5F5] ">
      <AdvertiseHero />

      <CategorySection />

      <ServicesSection />

      <AdvertiseCTA />
    </main>
  );
}

function AdvertiseHero() {
  return (
    <section className="relative h-[500px] overflow-hidden">
      <img
        src="/assets/ad-hero.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mt-20 flex h-full items-center justify-center">
        <div className="max-w-4xl px-6 text-center text-white">
          <span className="rounded-full bg-[#F58233] px-4 py-2 text-xs font-semibold">
            Advertise With LISTO
          </span>

          <h1 className="mt-6 text-[54px] font-black leading-[1.05] tracking-[-2px]">
            Reach the Right Audience.
            <br />
            Elevate Your Brand.
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-8 text-gray-200">
            Showcase your services to active buyers, sellers, investors and
            homeowners across Ontario.
          </p>
        </div>
      </div>
    </section>
  );
}

function CategorySection() {
  const icons = [
    Building2,
    Landmark,
    Scale,
    ShieldCheck,
    PaintBucket,
    BadgeDollarSign,
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((item, index) => {
            const Icon = icons[index];

            return (
              <div
                key={item}
                className="group rounded-2xl border border-[#E8E8E8] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F58233]/10">
                  <Icon size={28} className="text-[#F58233]" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#02132D]">
                  {item}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-[42px] font-black text-[#02132D]">
          Advertise Your Services
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className="overflow-hidden rounded-[26px] border border-[#D9D9D9] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)]"
            >
              <div className="grid md:grid-cols-2">
                <div className="p-7">
                  <h3 className="text-[28px] font-black text-[#F58233]">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-gray-600 leading-7">
                    {service.description}
                  </p>

                  <div className="mt-6 space-y-3">
                    {service.bullets.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-[#F58233]" />

                        <span className="text-sm text-[#02132D]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <img
                  src={service.image}
                  alt=""
                  className="h-full min-h-[260px] w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdvertiseCTA() {
  return (
    <section className="pb-24">
      <div className="text-center">
        <Link href={"/contact-us"}>
          <button className="rounded-full bg-[#F58233] px-8 py-4 font-semibold text-white shadow-lg shadow-[#F58233]/30 transition hover:scale-105">
            Get In Touch →
          </button>
        </Link>
      </div>
    </section>
  );
}
