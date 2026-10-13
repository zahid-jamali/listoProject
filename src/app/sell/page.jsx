"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowRight,
  TrendingUp,
  Users,
  BadgeDollarSign,
  CheckCircle2,
} from "lucide-react";

const reasons = [
  {
    title: "Expand Your Reach",
    description:
      "Reach more qualified buyers through LISTO's growing ecosystem of resale, pre-construction and investor traffic.",
    icon: Users,
  },
  {
    title: "Trusted Local Experts",
    description:
      "Work with experienced agents who understand pricing strategy, negotiation and market positioning.",
    icon: TrendingUp,
  },
  {
    title: "Lower Fees, Higher Returns",
    description:
      "Maximize your sale price while reducing unnecessary brokerage expenses and marketing costs.",
    icon: BadgeDollarSign,
  },
];

export default function SellPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    timeframe: "Within 3 months",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contactus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          msg: `[Sell With LISTO — Valuation Request]\nProperty Address: ${formData.address}\nTimeframe: ${formData.timeframe}\nNotes: ${formData.message}`,
          purpose: "GENERAL",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to submit request");
      }
      toast.success(
        "Thank you! A LISTO listing specialist will contact you with your property valuation.",
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        timeframe: "Within 3 months",
        message: "",
      });
    } catch (err) {
      toast.error(err.message || "Could not submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <section className="relative overflow-hidden bg-[#081A3A]">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-[-100px] top-[-100px] h-[280px] w-[280px] sm:h-[400px] sm:w-[400px] rounded-full bg-[#F97316]/20 blur-[120px]" />
          <div className="absolute right-[-100px] top-[50px] h-[280px] w-[280px] sm:h-[400px] sm:w-[400px] rounded-full bg-blue-500/20 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-14 sm:py-20 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center lg:text-left"
            >
              <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-white backdrop-blur-md">
                Sell With Confidence
              </span>

              <h1 className="mt-5 font-bold tracking-tight text-white text-2xl sm:text-3xl md:text-5xl leading-tight">
                Sell With
                <span className="block text-[#F97316]">LISTO</span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm sm:text-base leading-7 sm:leading-8 text-white/75 lg:mx-0">
                Maximize your property&apos;s value with expert pricing, premium
                marketing and a modern selling experience designed to reduce
                fees and increase exposure.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <a
                  href="#sell-consultation"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#F97316] px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1"
                >
                  Start Selling
                </a>

                <a
                  href="#why-sell"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition"
                >
                  Learn More
                </a>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl"
            >
              <img
                src="/assets/sold.png"
                alt="Sell With Listo"
                className="w-full h-[260px] sm:h-[380px] md:h-[450px] lg:h-[520px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="why-sell" className="py-20 lg:py-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-4 py-2 text-sm font-medium text-[#F97316]">
              Why Choose LISTO
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
              3 Reasons To Sell With LISTO
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6B7280] sm:text-base">
              A modern real-estate platform built to help sellers achieve better
              results with less friction.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;

              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF7ED]">
                    <Icon className="text-[#F97316]" size={28} />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-[#111827]">
                    {reason.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#6B7280]">
                    {reason.description}
                  </p>

                  <a
                    href="#sell-consultation"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#081A3A] hover:text-[#F97316] transition"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Free Home Valuation & Consultation Form */}
      <section
        id="sell-consultation"
        className="pb-24 pt-6 scroll-mt-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] items-center rounded-[36px] bg-[#081A3A] p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
            <div>
              <span className="inline-flex rounded-full bg-[#F97316]/20 border border-[#F97316]/40 px-4 py-1.5 text-xs font-semibold text-[#F97316]">
                Free Home Evaluation
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
                Find Out What Your Property Is Worth Today
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/75 leading-7">
                Request a complimentary Comparative Market Analysis (CMA) and
                custom marketing plan from our local Ontario listing specialists.
              </p>

              <div className="mt-8 space-y-3.5 text-sm text-white/90">
                {[
                  "Accurate pricing backed by live MLS® sold comparables",
                  "Professional photography, 3D tours & targeted digital campaigns",
                  "Access to LISTO's active buyer and investor database",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#F97316] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white p-6 sm:p-8 text-slate-900 shadow-xl space-y-4"
            >
              <h3 className="text-xl font-bold text-[#081A3A]">
                Request Your Free Valuation
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full h-11 rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(416) 555-0199"
                    className="w-full h-11 rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full h-11 rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Selling Timeframe
                  </label>
                  <select
                    name="timeframe"
                    value={formData.timeframe}
                    onChange={handleChange}
                    className="w-full h-11 rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-[#F97316]"
                  >
                    <option value="Immediately">Immediately</option>
                    <option value="Within 3 months">Within 3 months</option>
                    <option value="3 to 6 months">3 to 6 months</option>
                    <option value="Just curious about value">
                      Just curious about value
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Property Address / City *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, Toronto, ON"
                  className="w-full h-11 rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Additional Details (Optional)
                </label>
                <textarea
                  rows={3}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your property (beds, baths, upgrades)..."
                  className="w-full rounded-xl border border-slate-200 p-3.5 text-sm outline-none focus:border-[#F97316] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-xl bg-[#F97316] hover:bg-[#ea6a10] text-white font-semibold text-sm shadow-lg transition disabled:opacity-50"
              >
                {submitting ? "Submitting Request…" : "Get My Free Home Valuation →"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
