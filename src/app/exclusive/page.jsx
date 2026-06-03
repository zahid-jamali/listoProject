// app/exclusive-listings/page.jsx

"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  //   Facebook,
  //   Instagram,
  //   Youtube,
  //   Linkedin,
} from "lucide-react";

import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";

export default function ExclusiveListingsPage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "General",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleType = (type) => {
    setFormData({
      ...formData,
      type,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // API PATH AP YAHAN SET KAR DENA
      const res = await fetch("/api/contactus", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log(data);

      alert("Message sent successfully!");

      setFormData({
        name: "",
        phone: "",
        email: "",
        type: "General",
        message: "",
      });
    } catch (error) {
      console.log(error);

      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] py-16 container mx-auto mt-6">
      <div className="mx-auto max-w-[1450px] px-4 lg:px-8">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center">
            <div>
              <h1 className="text-[24px] font-black tracking-[-0.05em] text-[#F36B22] lg:text-[24px]">
                Exclusive Listings
              </h1>

              <p className="mt-6 max-w-[650px] text-[14px] leading-8 text-neutral-600">
                In the exclusive platform we provide you with listings to our
                large clientele base. Our platform consists of exclusive land,
                commercial buildings, assignments, etc that you will not see on
                any other real estate platform.
              </p>
            </div>

            {/* WHY CHOOSE */}
            <div className="mt-10">
              <h2 className="text-[24px] font-black tracking-[-0.04em] text-[#F36B22]">
                Why Choose Exclusive Listings?
              </h2>

              <p className="mt-5 max-w-[650px] text-[14px] leading-8 text-neutral-600">
                When sellers decide to offer their house through an exclusive
                listing, they usually do so in order to maintain their privacy.
                For security reasons, this is a popular choice for well-known
                clients, politicians, and celebrities.
              </p>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="overflow-hidden rounded-[28px] shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
            {/* IMAGE AP SET KAROGY */}
            <img
              src="/assets/exclusive.png"
              alt="Exclusive Listings"
              className="h-[420px] w-full object-cover"
            />
          </div>
        </div>

        {/* SECOND SECTION */}
        <div className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* IMAGE */}
          <div className="overflow-hidden rounded-[28px] shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
            {/* IMAGE AP SET KAROGY */}
            <img
              src="/assets/exclusive2.png"
              alt="Benefits"
              className="h-[420px] w-full object-cover"
            />
          </div>

          {/* CONTENT */}
          <div>
            <h2 className="max-w-[500px] text-[24px] font-black leading-tight tracking-[-0.05em] text-[#F36B22]">
              Benefits of Exclusive Listings with Listo
            </h2>

            <p className="mt-6 max-w-[650px] text-[14px] leading-8 text-neutral-600">
              Since it’s not listed on MLS, when you choose to list a property
              exclusively or privately through Listo, we are able to market it
              only to our exclusive clientele. With this help of this platform,
              you may showcase your property to a limited number of qualified
              purchasers or prospective buyers and invite to a private showing.
            </p>

            <div className="mt-10">
              <h3 className="text-[24px] font-black tracking-[-0.04em] text-[#F36B22]">
                Unlock Elite Properties with Listo
              </h3>

              <p className="mt-5 max-w-[650px] text-[14px] leading-8 text-neutral-600">
                With stringent privacy measures, personalized attention from our
                dedicated team, and access to an elite network of sellers and
                buyers, we invite you to unlock the doors to a select portfolio
                of properties that enables your real estate needs.
              </p>

              {/* BUTTON */}
              <button className="mt-8 rounded-full bg-gradient-to-r from-[#F36B22] to-[#ff8c4d] px-7 py-3 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(243,107,34,0.35)] transition-all duration-300 hover:scale-105">
                Active Exclusive Listings →
              </button>
            </div>
          </div>
        </div>

        {/* CONTACT SECTION */}
        <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr]">
          {/* LEFT INFO */}
          <div className="rounded-[28px]  p-8 ">
            <h2 className="text-[34px] font-black tracking-[-0.05em] text-[#0B132B]">
              Contact Us
            </h2>

            {/* EMAIL */}
            <div className="mt-10">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#F36B22]" />

                <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#0B132B]">
                  Email:
                </h3>
              </div>

              <p className="mt-3 text-[16px] font-medium text-neutral-600">
                info@listo.ca
              </p>
            </div>

            {/* PHONE */}
            <div className="mt-8">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#F36B22]" />

                <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#0B132B]">
                  Phone
                </h3>
              </div>

              <p className="mt-3 text-[16px] font-medium text-neutral-600">
                (905) 757-1234
              </p>
            </div>

            {/* WHATSAPP */}
            <div className="mt-8">
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-[#25D366]" />

                <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#0B132B]">
                  WhatsApp
                </h3>
              </div>

              <p className="mt-3 text-[16px] font-medium text-neutral-600">
                +1 905 757 1234
              </p>
            </div>

            {/* SOCIALS */}
            <div className="mt-10">
              <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#0B132B]">
                Follow Us:
              </h3>

              <div className="mt-5 flex items-center gap-4">
                {[FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn].map(
                  (Icon, index) => (
                    <button
                      key={index}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#0B132B] shadow-sm transition-all duration-300 hover:border-[#F36B22] hover:bg-[#F36B22] hover:text-white"
                    >
                      <Icon size={18} />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="rounded-[28px] bg-white p-8 shadow-[0_15px_45px_rgba(0,0,0,0.08)]">
            <h2 className="text-[34px] font-black tracking-[-0.05em] text-[#0B132B]">
              Send us a note:
            </h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* ROW */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* NAME */}
                <div>
                  <label className="mb-3 block text-sm font-black uppercase tracking-[0.12em] text-[#0B132B]">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your first name..."
                    className="h-[56px] w-full rounded-xl border border-neutral-200 bg-[#fafafa] px-5 text-sm outline-none transition-all focus:border-[#F36B22]"
                    required
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="mb-3 block text-sm font-black uppercase tracking-[0.12em] text-[#0B132B]">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number..."
                    className="h-[56px] w-full rounded-xl border border-neutral-200 bg-[#fafafa] px-5 text-sm outline-none transition-all focus:border-[#F36B22]"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-3 block text-sm font-black uppercase tracking-[0.12em] text-[#0B132B]">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address..."
                  className="h-[56px] w-full rounded-xl border border-neutral-200 bg-[#fafafa] px-5 text-sm outline-none transition-all focus:border-[#F36B22]"
                  required
                />
              </div>

              {/* FOR */}
              <div>
                <label className="mb-4 block text-sm font-black uppercase tracking-[0.12em] text-[#0B132B]">
                  For
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  {["General", "Investment", "Partnership"].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => handleType(type)}
                      className={`rounded-full px-5 py-2 text-xs font-black uppercase tracking-[0.12em] transition-all duration-300 ${
                        formData.type === type
                          ? "bg-[#F36B22] text-white shadow-lg"
                          : "border border-neutral-200 bg-white text-neutral-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* MESSAGE */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message..."
                  rows={7}
                  className="w-full rounded-[20px] border border-neutral-200 bg-[#fafafa] p-5 text-sm outline-none transition-all focus:border-[#F36B22]"
                  required
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="h-[58px] rounded-full bg-gradient-to-r from-[#F36B22] to-[#ff8c4d] px-10 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(243,107,34,0.35)] transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
