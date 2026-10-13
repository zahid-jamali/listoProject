"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailCheck, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

function VerifyAccountForm() {
  const searchParams = useSearchParams();
  const { updateUser, isLoggedIn } = useAuth();

  const token = useMemo(
    () => searchParams.get("token") || "",
    [searchParams],
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleVerify = async () => {
    setError("");
    if (!token) {
      setError("Verification token is missing. Open the link from your email.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/user/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(
          data?.message ||
            "There was a problem verifying your account. The link may have expired.",
        );
      }

      if (isLoggedIn) {
        updateUser({ verified: true });
      }

      setDone(true);
      toast.success(data.message || "Email verified successfully.");
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <MailCheck className="mx-auto mb-4 text-[#F36B22]" size={36} />
        <h1 className="text-xl font-bold text-[#0B132B]">Invalid link</h1>
        <p className="mt-2 text-sm text-slate-500">
          This verification link is missing a token. Please use the link from
          your email.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#F36B22]"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <MailCheck className="mx-auto mb-4 text-emerald-600" size={36} />
        <h1 className="text-xl font-bold text-[#0B132B]">Email verified</h1>
        <p className="mt-2 text-sm text-slate-500">
          Return to the signup window and click <strong>Refresh</strong> to
          continue. You can sign in anytime with the PIN we emailed you.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#F36B22]"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <MailCheck className="mx-auto mb-4 text-[#F36B22]" size={36} />
        <h1 className="text-2xl font-bold text-[#0B132B]">Verify your email</h1>
        <p className="mt-2 text-sm text-slate-500">
          Confirm this email address to finish setting up your Listo account.
          Your login PIN is already in the email we sent.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleVerify}
        disabled={submitting}
        className="w-full rounded-xl bg-[#F36B22] py-3 text-sm font-bold text-white transition hover:bg-[#e05f1b] disabled:opacity-60"
      >
        {submitting ? "Verifying…" : "Verify email"}
      </button>
    </div>
  );
}

export default function VerifyAccountPage() {
  return (
    <main className="min-h-[70vh] bg-[#f7f7f7] px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <Suspense
          fallback={
            <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
              Loading…
            </div>
          }
        >
          <VerifyAccountForm />
        </Suspense>
      </div>
    </main>
  );
}
