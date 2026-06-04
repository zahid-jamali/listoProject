// Premium Exclusive Listings Page - Next.js App Router
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

export default function ExclusiveListingsPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call - Replace with your actual endpoint
      await new Promise((r) => setTimeout(r, 1500));
      setSubmitted(true);
      setFormData({ name: "", phone: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const statsData = [
    { value: "5,000+", label: "Verified Buyers", icon: "" },
    { value: "$2B+", label: "Property Value", icon: "" },
    { value: "98%", label: "Client Satisfaction", icon: "" },
    { value: "24/7", label: "Dedicated Support", icon: "" },
  ];

  const featuresData = [
    {
      title: "Private Access",
      description:
        "Premium experience designed for high-value transactions with complete confidentiality.",
      icon: "🔒",
      color: "bg-orange-50",
    },
    {
      title: "Qualified Buyers",
      description:
        "Pre-vetted network of serious investors and luxury property seekers.",
      icon: "🎯",
      color: "bg-blue-50",
    },
    {
      title: "Maximum Privacy",
      description:
        "NDA-protected listings with secure viewing arrangements and discretion guaranteed.",
      icon: "🤫",
      color: "bg-purple-50",
    },
  ];

  const stepsData = [
    {
      title: "Submit Property",
      description: "Tell us about your property with photos and details.",
    },
    {
      title: "Get Verified",
      description: "Our team reviews and approves within 24 hours.",
    },
    {
      title: "Connect Buyers",
      description: "Qualified buyers reach you directly for private showings.",
    },
  ];

  const contactInfo = [
    { icon: Mail, text: "info@listo.ca", href: "mailto:info@listo.ca" },
    { icon: Phone, text: "(905) 757-1234", href: "tel:+19057571234" },
    {
      icon: MessageCircle,
      text: "+1 905 757 1234",
      href: "https://wa.me/19057571234",
    },
  ];

  const socialIcons = [
    {
      icon: FaFacebookF,
      href: "https://facebook.com",
      color: "hover:bg-[#1877f2]",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com",
      color: "hover:bg-gradient-to-tr from-[#f09433] to-[#bc1888]",
    },
    {
      icon: FaTwitter,
      href: "https://twitter.com",
      color: "hover:bg-[#1da1f2]",
    },
    {
      icon: FaLinkedinIn,
      href: "https://linkedin.com",
      color: "hover:bg-[#0077b5]",
    },
    {
      icon: FaYoutube,
      href: "https://youtube.com",
      color: "hover:bg-[#ff0000]",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-white overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-20">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16"
        >
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 sm:mb-5 inline-flex rounded-full border border-orange-200 bg-orange-50/80 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-[#F36B22] shadow-sm"
            >
              ✨ Premium Private Marketplace
            </motion.span>

            <h1 className="text-2xl sm:text-3xl md:text-5xl  font-bold tracking-tight text-slate-900 leading-tight">
              Exclusive{" "}
              <span className="bg-gradient-to-r from-[#F36B22] to-orange-500 bg-clip-text text-transparent">
                Listings
              </span>
            </h1>

            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 lg:mx-0">
              Access off-market opportunities, luxury properties, private
              investments and exclusive real-estate inventory unavailable on
              traditional listing platforms.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-gradient-to-r from-[#F36B22] to-orange-500 px-5 py-3 sm:px-7 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore Listings →
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm px-5 py-3 sm:px-7 sm:py-4 text-sm sm:text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
              >
                Learn More
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/40 bg-gradient-to-br from-white to-orange-50/30 p-1.5 sm:p-2 shadow-2xl">
              <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                <img
                  src="/assets/exclusive.png"
                  alt="Luxury property showcase"
                  className="w-full h-[200px] sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[540px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 rounded-2xl sm:rounded-3xl pointer-events-none"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-12 sm:mt-16 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
        >
          {statsData.map((stat, idx) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              whileHover={{ y: -5 }}
              className="group rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-4 sm:p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 group-hover:text-[#F36B22] transition-colors">
                {stat.value}
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-16 sm:mt-20 lg:mt-28"
        >
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs sm:text-sm font-bold text-[#F36B22] uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Premium Features for Elite Clients
            </h2>
          </div>
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
            {featuresData.map((feature, idx) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="group rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-5 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* <div
                  className={`text-3xl sm:text-4xl mb-3 sm:mb-4 p-3 rounded-2xl ${feature.color} inline-block group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div> */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#F36B22] transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 sm:mt-24 lg:mt-32"
        >
          <div className="text-center">
            <span className="text-xs sm:text-sm font-bold text-[#F36B22] uppercase tracking-wider">
              ⚡ Simple Process
            </span>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Sell Privately In 3 Easy Steps
            </h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
              Simple, secure, and tailored for premium sellers
            </p>
          </div>

          <div className="mt-10 sm:mt-12 grid gap-5 sm:gap-6 md:grid-cols-3">
            {stepsData.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-5 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 text-xl sm:text-2xl font-bold text-[#F36B22]">
                  {i + 1}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600">
                  {step.description}
                </p>
                {i < stepsData.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#F36B22] text-2xl">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-16 sm:mt-20 lg:mt-28 grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl order-2 lg:order-1"
          >
            <img
              src="/assets/exclusive2.png"
              alt="Benefits showcase"
              className="w-full h-[200px] sm:h-[340px] md:h-[420px] lg:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          <div className="text-center lg:text-left order-1 lg:order-2">
            <span className="text-xs sm:text-sm font-bold text-[#F36B22] uppercase tracking-wider">
              Why Listo
            </span>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Benefits of Working With Listo
            </h2>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600">
              Showcase properties privately, connect with verified buyers,
              maintain confidentiality and unlock premium investment
              opportunities through our exclusive network.
            </p>
            <div className="mt-5 space-y-2">
              {[
                "100% Confidential",
                "Verified Buyers Only",
                "No Public Listing",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 justify-center lg:justify-start"
                >
                  <CheckCircle className="w-4 h-4 text-[#F36B22]" />
                  <span className="text-sm text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 sm:px-7 sm:py-4 text-sm sm:text-base font-semibold text-white hover:bg-slate-800 transition-all duration-300"
            >
              Active Exclusive Listings
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.section>

        {/* CTA Banner */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-20 sm:mt-24 lg:mt-28 overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[40px] bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-12 lg:p-16 text-white relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F36B22]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="relative max-w-3xl">
            <span className="inline-block rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold">
              🚀 Exclusive Network
            </span>
            <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Access Buyers Before Anyone Else
            </h2>
            <p className="mt-3 sm:mt-5 text-base sm:text-lg text-white/80 max-w-2xl">
              Join Listo's private marketplace and connect with serious buyers
              looking for premium opportunities.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 sm:mt-8 rounded-2xl bg-gradient-to-r from-[#F36B22] to-orange-500 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Join Now →
            </motion.button>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-16 sm:mt-20 lg:mt-28 grid gap-5 sm:gap-6 lg:gap-8 md:grid-cols-2 xl:grid-cols-[360px_1fr]"
        >
          {/* Contact Info Card */}
          <motion.div
            variants={staggerItem}
            className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 text-white"
          >
            <h3 className="text-2xl sm:text-3xl font-bold">Contact Us</h3>
            <p className="mt-2 text-white/70 text-sm">
              Get in touch with our team
            </p>

            <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
              {contactInfo.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                >
                  <div className="p-2 rounded-xl bg-white/10 group-hover:bg-[#F36B22] transition-colors">
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm sm:text-base">{item.text}</span>
                </a>
              ))}
            </div>

            <div className="mt-6 sm:mt-8">
              <p className="text-sm text-white/70 mb-3">Follow us</p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {socialIcons.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/10 hover:${social.color} transition-all duration-300 hover:scale-110`}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={staggerItem}
            className="rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 lg:p-8 shadow-xl"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Send Us a Message
            </h3>
            <p className="mt-1 text-slate-500 text-sm">
              We'll respond within 24 hours
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 sm:mt-8 space-y-4 sm:space-y-5"
            >
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="h-11 sm:h-12 rounded-xl border border-slate-200 px-4 text-sm focus:border-[#F36B22] focus:ring-2 focus:ring-[#F36B22]/20 transition-all outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  className="h-11 sm:h-12 rounded-xl border border-slate-200 px-4 text-sm focus:border-[#F36B22] focus:ring-2 focus:ring-[#F36B22]/20 transition-all outline-none"
                />
              </div>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="h-11 sm:h-12 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-[#F36B22] focus:ring-2 focus:ring-[#F36B22]/20 transition-all outline-none"
              />

              <textarea
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your requirements..."
                required
                className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-[#F36B22] focus:ring-2 focus:ring-[#F36B22]/20 transition-all outline-none resize-none"
              />

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full h-11 sm:h-12 rounded-xl font-semibold text-white transition-all duration-300 ${
                  loading
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#F36B22] to-orange-500 hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : submitted ? (
                  "✓ Message Sent!"
                ) : (
                  "Send Message"
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}
