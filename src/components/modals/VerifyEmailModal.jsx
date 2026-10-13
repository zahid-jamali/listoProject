"use client";

import { useState } from "react";
import { X, RefreshCw, Send, MailCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Shown when the user has a soft session but email is not verified yet.
 * Actions: Resend PIN+verify email, Refresh status.
 */
export default function VerifyEmailModal({
  isOpen,
  onClose,
  email: emailProp = "",
  title = "Verify your email",
  description = "We sent a login PIN and a verification link to your inbox. Open the link, then click Refresh.",
  dismissable = true,
}) {
  const { token, user, updateUser } = useAuth();
  const email = emailProp || user?.email || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  if (!isOpen) return null;

  const authHeaders = () => {
    const authToken = token || sessionStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/user/signup/resend", {
        method: "POST",
        headers: authHeaders(),
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
      const res = await fetch("/api/user/signup/status", {
        method: "GET",
        headers: authHeaders(),
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
        setTimeout(() => onClose?.(), 700);
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

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          {dismissable && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 transition hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-start gap-3 rounded-xl bg-orange-50 px-4 py-3 text-sm text-slate-700">
            <MailCheck className="mt-0.5 shrink-0 text-[#F36B22]" size={18} />
            <p>
              {email ? (
                <>
                  Check <strong>{email}</strong> for your PIN and verify link.
                </>
              ) : (
                <>Check your inbox for your PIN and verify link.</>
              )}
            </p>
          </div>

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
