"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { useState } from "react";

export default function ContactUsPage() {
  const [selected, setSelected] = useState("General");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const categories = ["General", "Investment", "Partnership"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          category: selected,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setSuccess("Thank you! Your message has been sent successfully.");

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });

      setSelected("General");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#F5F5F5] py-14">
      <div className="mx-auto max-w-6xl px-5 mt-20">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          {/* LEFT PANEL */}

          <div className="pt-4">
            <h1 className="text-[34px] font-black leading-tight text-[#02132D]">
              Get in-touch
              <br />
              with us
            </h1>

            <p className="mt-5 text-[13px] leading-6 text-[#6B7280]">
              We're here to help! Whether you have a question about our
              services, need assistance with your account, or just want to
              connect, our team is ready to assist you.
            </p>

            <div className="mt-8">
              <p className="text-[11px] uppercase tracking-wider text-gray-400">
                Email
              </p>

              <a
                href="mailto:info@listo.ca"
                className="mt-1 block text-[20px] font-semibold text-[#02132D]"
              >
                info@listo.ca
              </a>
            </div>

            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-wider text-gray-400">
                Phone
              </p>

              <a
                href="tel:+19057571234"
                className="mt-1 block text-[20px] font-semibold text-[#02132D]"
              >
                (905) 757-1234
              </a>
            </div>

            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-wider text-gray-400">
                Whatsapp
              </p>

              <span className="mt-1 inline-block text-[14px] text-green-600">
                Available Now
              </span>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-[11px] uppercase tracking-wider text-gray-400">
                Follow Us
              </p>

              <div className="flex gap-3">
                <SocialIcon>
                  <FaFacebookF size={14} />
                </SocialIcon>

                <SocialIcon>
                  <FaInstagram size={14} />
                </SocialIcon>

                <SocialIcon>
                  <FaYoutube size={14} />
                </SocialIcon>

                <SocialIcon>
                  <FaLinkedinIn size={14} />
                </SocialIcon>
              </div>
            </div>
          </div>

          {/* FORM CARD */}

          <div className="rounded-[18px] border border-[#D8D8D8] bg-white p-7 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
            <h2 className="text-[22px] font-bold text-[#02132D]">
              Send us a note:
            </h2>

            <form onSubmit={handleSubmit} className="mt-5">
              {/* NAME / PHONE */}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-gray-600">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name..."
                    className="h-11 w-full rounded-lg border border-[#D8D8D8] px-4 text-sm outline-none focus:border-[#F58233]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[12px] font-medium text-gray-600">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Give us your phone number..."
                    className="h-11 w-full rounded-lg border border-[#D8D8D8] px-4 text-sm outline-none focus:border-[#F58233]"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="mt-4">
                <label className="mb-1 block text-[12px] font-medium text-gray-600">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address..."
                  className="h-11 w-full rounded-lg border border-[#D8D8D8] px-4 text-sm outline-none focus:border-[#F58233]"
                  required
                />
              </div>

              {/* FOR */}

              <div className="mt-5">
                <label className="block text-[13px] font-semibold text-[#02132D]">
                  For
                </label>

                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelected(item)}
                      className={`rounded-full px-4 py-1.5 text-[12px] font-semibold transition ${
                        selected === item
                          ? "bg-[#F58233] text-white"
                          : "bg-[#02132D] text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* MESSAGE */}

              <div className="mt-5">
                <textarea
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message..."
                  className="w-full resize-none rounded-xl border border-[#D8D8D8] p-4 text-sm outline-none focus:border-[#F58233]"
                  required
                />
              </div>

              {/* BUTTON */}

              {success && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-[#02132D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B2347] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

function SocialIcon({ children }) {
  return (
    <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[#D8D8D8] text-[#02132D] transition hover:border-[#F58233] hover:text-[#F58233]">
      {children}
    </button>
  );
}
