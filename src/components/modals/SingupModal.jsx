"use client";

import { useEffect, useState } from "react";
import { X, Mail, User, Phone, RefreshCw, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Email-first PIN signup:
 * 1) email → soft account + PIN emailed
 * 2) name + phone
 * 3) Resend email / Refresh (after user verifies)
 */
export default function SignupModal({ isOpen, onClose, login: goToLogin }) {
  const { login, updateUser, token } = useAuth();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setEmail("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setError("");
      setInfo("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/user/signup/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.account_exists) {
        throw new Error(
          data.message ||
            "This email is already registered. Please sign in or use Forgot PIN.",
        );
      }

      if (!res.ok || !data.token) {
        throw new Error(data.message || "Unable to create account");
      }

      login({
        token: data.token,
        name: data.name,
        email: data.email || email,
        verified: false,
        must_set_password: false,
      });

      const local = String(email).split("@")[0] || "";
      const guess = local.replace(/[._+-]+/g, " ").trim();
      if (guess && !firstName) {
        const parts = guess.split(/\s+/);
        setFirstName(parts[0] ? parts[0][0].toUpperCase() + parts[0].slice(1) : "");
        if (parts[1]) {
          setLastName(parts[1][0].toUpperCase() + parts[1].slice(1));
        }
      }

      setInfo(
        "Check your email — we sent your login PIN and a verification link.",
      );
      setStep(2);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError("Please enter your name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const authToken = token || sessionStorage.getItem("token");
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not save your details");
      }

      updateUser({
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email,
      });
      setInfo("Almost done — verify your email, then click Refresh.");
      setStep(3);
    } catch (err) {
      setError(err.message || "Could not save your details");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const authToken = token || sessionStorage.getItem("token");
      const res = await fetch("/api/user/signup/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not resend email");
      }
      setInfo(data.message || "Email resent. Check your inbox for your PIN.");
    } catch (err) {
      setError(err.message || "Could not resend email");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const authToken = token || sessionStorage.getItem("token");
      const res = await fetch("/api/user/signup/status", {
        method: "GET",
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not check status");
      }

      if (data.verified) {
        updateUser({
          verified: true,
          email: data.email || email,
          name: data.name || undefined,
        });
        setInfo("Email verified — you're all set!");
        setTimeout(() => onClose(), 800);
      } else {
        setError(
          "Email not verified yet. Open the link in your inbox, then click Refresh again.",
        );
      }
    } catch (err) {
      setError(err.message || "Could not check verification status");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const fieldWrap = "flex items-center rounded-xl border px-4";
  const inputClass = "w-full border-none bg-transparent px-3 py-3 outline-none";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {step === 1 && "Create Account"}
              {step === 2 && "Your details"}
              {step === 3 && "Verify your email"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {step === 1 && "Start with your email — we’ll send a login PIN"}
              {step === 2 && "Tell us how to reach you"}
              {step === 3 && "Verify, then refresh to continue"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>
                <div className={fieldWrap}>
                  <Mail size={18} className="text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#F36B22] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Sending…" : "Continue"}
              </button>

              <button
                type="button"
                onClick={goToLogin}
                disabled={loading}
                className="w-full rounded-xl bg-[#154d1c] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                Sign in
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  First name
                </label>
                <div className={fieldWrap}>
                  <User size={18} className="text-slate-400" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className={inputClass}
                    autoComplete="given-name"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Last name
                </label>
                <div className={fieldWrap}>
                  <User size={18} className="text-slate-400" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className={inputClass}
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Phone</label>
                <div className={fieldWrap}>
                  <Phone size={18} className="text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className={inputClass}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#F36B22] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Saving…" : "Continue"}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-slate-600">
                We emailed a <strong>login PIN</strong> and a verification link
                to <strong>{email}</strong>. Open the link, then click Refresh
                below.
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <Send size={16} />
                {loading ? "Working…" : "Resend email"}
              </button>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F36B22] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                <RefreshCw size={16} />
                {loading ? "Checking…" : "Refresh"}
              </button>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {info && (
            <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
              {info}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
