"use client";

import { useEffect, useState } from "react";
import { X, Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import VerifyEmailModal from "@/components/modals/VerifyEmailModal";

export default function LoginModal({ isOpen, onClose, signup }) {
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // login | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [showVerify, setShowVerify] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMode("login");
      setEmail("");
      setPassword("");
      setError("");
      setInfo("");
      setLoading(false);
      setShowVerify(false);
    }
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setInfo("");

      const response = await fetch("/api/user/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      const message =
        typeof data?.message === "string"
          ? data.message
          : data?.message?.message || "Invalid email or PIN";

      if (!response.ok || !data.token) {
        throw new Error(message);
      }

      // Soft-store session so Resend/Refresh work, then require verify if needed
      login({
        ...data,
        verified: data.verified === true || data.verified === 1,
        must_set_password: Boolean(data.must_set_password),
        email: data.email || email,
      });

      if (data.needs_verification || data.verified === false) {
        setShowVerify(true);
        return;
      }

      onClose();
    } catch (err) {
      setError(err.message || "Invalid email or PIN");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setInfo("");

      const res = await fetch("/api/user/pin/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not send PIN");
      }
      setInfo(
        data.message ||
          "If an account exists for that email, a new PIN has been sent.",
      );
    } catch (err) {
      setError(err.message || "Could not send PIN");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !showVerify) return null;

  return (
    <>
      {isOpen && !showVerify && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {mode === "login" ? "Welcome Back" : "Forgot PIN"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {mode === "login"
                    ? "Sign in with your email and PIN"
                    : "We’ll email you a new login PIN"}
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

            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                  </label>
                  <div className="flex items-center rounded-xl border px-4">
                    <Mail size={18} className="text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-none bg-transparent px-3 py-3 outline-none"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium">PIN</label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError("");
                        setInfo("");
                      }}
                      className="text-xs font-semibold text-[#F36B22] hover:underline"
                    >
                      Forgot PIN?
                    </button>
                  </div>
                  <div className="flex items-center rounded-xl border px-4">
                    <Lock size={18} className="text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="6-digit PIN"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-none bg-transparent px-3 py-3 outline-none"
                      autoComplete="current-password"
                      inputMode="numeric"
                    />
                  </div>
                </div>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#F36B22] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Signing In…" : "Sign In"}
                </button>

                <button
                  type="button"
                  onClick={signup}
                  disabled={loading}
                  className="w-full rounded-xl bg-[#308432] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  Create Account
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotPin} className="space-y-5 p-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setInfo("");
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft size={14} /> Back to sign in
                </button>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                  </label>
                  <div className="flex items-center rounded-xl border px-4">
                    <Mail size={18} className="text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-none bg-transparent px-3 py-3 outline-none"
                      autoComplete="email"
                    />
                  </div>
                </div>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#F36B22] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Send new PIN"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <VerifyEmailModal
        isOpen={showVerify}
        email={email}
        onClose={() => {
          setShowVerify(false);
          onClose();
        }}
      />
    </>
  );
}
