"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, PhoneCall, Mail } from "lucide-react";

const faqs = [
  {
    question: "What is the minimum down payment in Ontario?",
    answer:
      "For homes up to $500,000, the minimum down payment is 5%. For homes between $500,000 and $1,499,999, it is 5% on the first $500,000 and 10% on the remaining portion. Homes priced at $1.5 million or more require a minimum 20% down payment.",
  },
  {
    question: "How can I get my listing featured on LISTO?",
    answer:
      "Featured listings receive priority placement across our homepage, city search results, and investor feeds. Contact our brokerage team or visit our Advertise page to learn about promotional packages.",
  },
  {
    question: "What are Developer & Pre-Construction listings?",
    answer:
      "Developer listings showcase upcoming pre-construction condo, townhome, and detached developments directly from builders across Ontario, complete with floor plans, deposit structures, and VIP pricing.",
  },
  {
    question: "How does Listo manage Co-Ownership requests?",
    answer:
      "Listo connects compatible buyers and facilitates the co-ownership journey through experienced real estate advisors, mortgage specialists, and legal professionals.",
  },
  {
    question: "When can I list my assignment deal?",
    answer:
      "Assignment listings can be submitted as soon as your builder's Purchase and Sale Agreement permits assignment sales and all required builder consents and documentation are ready.",
  },
  {
    question: "What are the New Buyers Tools?",
    answer:
      "Our New Buyers suite includes interactive 'What Can I Buy' and 'Where Can I Buy' budget matchers, mortgage & closing cost calculators, Ontario rebate guides, and live community market statistics.",
  },
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className="bg-[#F5F5F5] py-14 mt-20 min-h-screen">
      <div className="mx-auto max-w-4xl px-5">
        {/* TOP INFO */}
        <section>
          <span className="inline-flex rounded-full bg-[#F58233]/10 border border-[#F58233]/30 px-3.5 py-1 text-xs font-semibold text-[#F58233]">
            Help Center
          </span>
          <h1 className="mt-3 text-[36px] sm:text-[42px] font-black tracking-[-1px] text-[#02132D]">
            Frequently Asked Questions
          </h1>

          <div className="mt-5 rounded-2xl border border-[#D8D8D8] bg-white px-7 py-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <p className="text-[14px] leading-6 text-[#4B5563]">
              Have questions about buying, selling, pre-construction projects, or real estate investing in Ontario? Browse our most common questions below or reach out directly to a LISTO advisor for personalized guidance.
            </p>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="mt-12">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={activeIndex === index}
                onClick={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </section>

        {/* CONTACT BOX */}
        <section className="mt-10">
          <div className="rounded-2xl border border-[#D8D8D8] bg-white px-7 py-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[15px] font-semibold text-[#02132D]">
                Didn&apos;t find what you were looking for?
              </p>
              <p className="mt-1 text-sm text-[#4B5563] flex flex-wrap items-center gap-4">
                <a
                  href="tel:+19057571234"
                  className="inline-flex items-center gap-1.5 text-[#F58233] font-medium hover:underline"
                >
                  <PhoneCall size={14} /> (905) 757-1234
                </a>
                <a
                  href="mailto:info@listo.ca"
                  className="inline-flex items-center gap-1.5 text-[#F58233] font-medium hover:underline"
                >
                  <Mail size={14} /> info@listo.ca
                </a>
              </p>
            </div>

            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center rounded-full bg-[#F58233] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 shrink-0"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#D8D8D8] bg-white shadow-sm">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-[#02132D]">
          {faq.question}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 shrink-0 ml-3 ${
            isOpen ? "rotate-180 text-[#F58233]" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#ECECEC] px-6 py-5">
            <p className="text-[14px] leading-7 text-[#6B7280]">{faq.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
