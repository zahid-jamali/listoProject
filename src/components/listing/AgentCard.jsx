"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  applyInquiryAuthResult,
  extractInquiryError,
} from "@/lib/inquiry-auth";
import VerifyEmailModal from "@/components/modals/VerifyEmailModal";
import LoginModal from "@/components/modals/LoginModal";
import SignupModal from "@/components/modals/SingupModal";

export default function AgentCard({ defaultMessage, listing = null }) {
  const { login, isLoggedIn, token } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState(defaultMessage || "");
  const [submitting, setSubmitting] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    if (defaultMessage) setMessage(defaultMessage);
  }, [defaultMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please enter your name and email");
      return;
    }
    setSubmitting(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/listing-inquiry", {
        method: "POST",
        headers,
        body: JSON.stringify({
          prop_id: listing?.id,
          prop_type: listing?.type || "RS",
          brd: listing?.brd || "TREB",
          access_url: listing?.access_url || "",
          name: form.name,
          email: form.email,
          phone: form.phone,
          msg: message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(extractInquiryError(data));
      }

      const result = applyInquiryAuthResult(data, { login, isLoggedIn });
      toast.success(result.toast);
      if (result.needs_verify) {
        setVerifyEmail(result.email || form.email);
        setShowVerify(true);
      } else if (result.needs_login) {
        setShowLogin(true);
      }
      setForm({ name: "", email: "", phone: "" });
      setMessage(defaultMessage || "");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#F36B22] focus:ring-1 focus:ring-[#F36B22]/30";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold tracking-tight text-[#0B132B]">
          Inquire about this property
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          We&apos;ll get back to you shortly.
        </p>
      </div>

      <form onSubmit={handleInquiry} className="space-y-2.5">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Full name"
          className={fieldClass}
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className={fieldClass}
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone (optional)"
          className={fieldClass}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Your message"
          className={`${fieldClass} resize-none`}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#F36B22] py-2.5 text-sm font-semibold text-white transition hover:bg-[#e05f1b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send inquiry"}
        </button>
      </form>

      <VerifyEmailModal
        isOpen={showVerify}
        email={verifyEmail}
        onClose={() => setShowVerify(false)}
      />
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        signup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        login={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
}
