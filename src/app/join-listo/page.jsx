import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const benefits = [
  "A personable individual, as service is ingrained in our essence.",
  "An adversary dedicated to ensuring customers emerge victorious.",
  "Adept multitasker, thriving in the dynamic environment of LISTO.",
];

const features = [
  {
    title: "Increased Leads",
    description:
      "Receive warm leads directly to your inbox daily and convert opportunities faster.",
    icon: "📈",
  },
  {
    title: "Top-Tier Technology",
    description:
      "Advanced CRM, AI-powered insights and marketing tools to simplify your workflow.",
    icon: "⚙️",
  },
  {
    title: "Emerging Real Estate Hub",
    description: "Join one of Canada's fastest-growing real estate ecosystems.",
    icon: "🏢",
  },
];

export default function JoinListoPage() {
  return (
    <main className="bg-white">
      <JoinHero />
      <WhyJoinSection />
      <FeatureSection />
    </main>
  );
}

function FeatureSection() {
  return (
    <section className="bg-white pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[28px] border border-[#E5E7EB] bg-white p-8 shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-5xl">{feature.icon}</div>

              <h3 className="mt-6 text-[26px] font-bold text-[#02132D]">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href={"/contact-us"}>
            <button className="rounded-full bg-[#F58233] px-8 py-4 font-semibold text-white shadow-lg shadow-[#F58233]/30 transition hover:scale-105">
              Connect With Us →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyJoinSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:gap-20 lg:grid-cols-2">
          {/* LEFT */}

          <div>
            <h2 className="text-3xl sm:text-[42px] lg:text-[52px] font-black leading-tight text-[#02132D]">
              You should fit right in,
              <br />
              if you are
            </h2>

            <p className="mt-5 text-gray-600 leading-8">
              We are looking for elite professionals who embody integrity,
              innovation and client-first service.
            </p>

            <div className="mt-12 space-y-8">
              {benefits.map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#F58233]/10 shrink-0">
                    <CheckCircle2 className="text-[#F58233]" size={20} />
                  </div>

                  <p className="text-base sm:text-[19px] font-semibold text-[#02132D]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}

          <div className="relative">
            <img
              src="/assets/join-listo-2.png"
              alt=""
              className="h-[360px] sm:h-[480px] lg:h-[600px] w-full rounded-[28px] sm:rounded-[36px] object-cover shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            />

            <div className="mt-4 sm:mt-0 sm:absolute sm:bottom-10 sm:left-[-20px] lg:left-[-40px] max-w-[320px] rounded-[24px] bg-[#02132D] p-5 sm:p-6 text-white shadow-2xl">
              <p className="italic text-gray-300 text-sm">
                “Joining LISTO was the catalyst my career needed. The technology
                is years ahead of the competition.”
              </p>

              <div className="mt-4 text-[#F58233] font-semibold text-sm">
                Sarah J. — Senior Associate
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JoinHero() {
  return (
    <section className="relative min-h-[460px] sm:h-[520px] overflow-hidden">
      <img
        src="/assets/join-listo-1.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 flex h-full items-center justify-center py-20 sm:py-0">
        <div className="max-w-4xl px-4 sm:px-6 text-center text-white">
          <span className="rounded-full bg-[#F58233] px-4 py-2 text-xs font-semibold tracking-wide">
            Real Estate Professionals Welcome!
          </span>

          <h1 className="mt-6 text-3xl sm:text-[44px] md:text-[58px] font-black leading-[1.1] sm:leading-[1.05] tracking-[-1px] sm:tracking-[-2px]">
            Join the Fastest Growing
            <br />
            Real Estate Platform
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-sm sm:text-[15px] leading-7 sm:leading-8 text-gray-200">
            LISTO stands out as the real estate company tailored to current
            needs. Our technology, data insights and support ecosystem help
            agents grow faster and serve clients better.
          </p>
        </div>
      </div>
    </section>
  );
}
