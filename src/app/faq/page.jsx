"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is the minimum down payment in Ontario?",
    answer:
      "For homes up to $500,000, the minimum down payment is 5%. For homes between $500,000 and $999,999, it's 5% on the first $500k and 10% on the remainder. Homes over $1 million require 20% down.",
  },
  {
    question: "How can I get my listing featured?",
    answer:
      "Featured listings receive enhanced visibility across our platform. Contact our team to discuss available promotional opportunities.",
  },
  {
    question: "What are the Developer listings?",
    answer:
      "Developer listings showcase pre-construction and new development opportunities directly from builders and developers.",
  },
  {
    question: "How does Listo manage Co-Ownership requests?",
    answer:
      "Listo helps connect interested buyers and facilitates the co-ownership process through trusted partners and legal professionals.",
  },
  {
    question: "When can I list my assignment deal?",
    answer:
      "Assignment listings can be submitted once the builder's agreement permits assignment sales and all required documentation is available.",
  },
  {
    question: "What are the New Buyers Tools?",
    answer:
      "Our tools include affordability calculators, mortgage estimators, rebate guides, closing cost calculators and market insights.",
  },
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className="bg-[#F5F5F5] py-14 mt-20">
      <div className="mx-auto max-w-4xl px-5">
        {/* TOP INFO */}

        <section>
          <h1 className="text-[40px] font-black tracking-[-1px] text-[#02132D]">
            Browse Real Estate by Location
          </h1>

          <div className="mt-5 rounded-2xl border border-[#D8D8D8] bg-white px-7 py-5 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
            <p className="text-[14px] leading-6 text-[#4B5563]">
              Explore real estate listings by location to find your ideal home,
              condo, or rental property. Our platform provides detailed insights
              into property prices and market trends, making it easy to browse
              and compare options. Whether buying, renting, or investing, access
              up-to-date statistics to make informed decisions.
            </p>
          </div>
        </section>

        {/* FAQ HEADING */}

        <section className="mt-20">
          <h2 className="text-center text-[36px] font-black text-[#02132D]">
            Frequently Asked Questions
          </h2>

          <div className="mt-10 space-y-4">
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
          <div className="rounded-2xl border border-[#D8D8D8] bg-white px-7 py-6 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
            <p className="text-[15px] italic text-[#374151]">
              Didn't find what you were looking for? Please call us at
            </p>

            <button className="mt-4 rounded-full bg-[#F58233] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90">
              Contact Us
            </button>
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
        onClick={onClick}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-[#02132D]">
          {faq.question}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
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
