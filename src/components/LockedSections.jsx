"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/modals/LoginModal";
import SignupModal from "@/components/modals/SingupModal";
import VerifyEmailModal from "@/components/modals/VerifyEmailModal";

/**
 * Wraps property-detail content that should only be fully visible to
 * authenticated + email-verified users.
 */
export default function LockedSections({
  children,
  description = "Access price history, comparisons, area insights & more.",
}) {
  const { isLoggedIn, isVerified, loading, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  if (loading || (isLoggedIn && isVerified)) {
    return <>{children}</>;
  }

  if (isLoggedIn && !isVerified) {
    return (
      <>
        <div
          className="pointer-events-none select-none overflow-x-clip blur-[6px]"
          aria-hidden="true"
        >
          {children}
        </div>
        <div className="fixed inset-x-0 bottom-[72px] z-40 border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_rgba(0,0,0,0.10)] backdrop-blur lg:bottom-0">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <p className="text-sm font-bold text-slate-900">
              Verify your email to unlock full details
            </p>
            <button
              type="button"
              onClick={() => setShowVerify(true)}
              className="rounded-xl bg-[#F58232] px-5 py-2.5 text-sm font-bold text-white"
            >
              Verify email
            </button>
          </div>
        </div>
        <VerifyEmailModal
          isOpen={showVerify}
          email={user?.email}
          onClose={() => setShowVerify(false)}
        />
      </>
    );
  }

  return (
    <>
      {/* Blurred, non-interactive information & graphs */}
      <div
        className="pointer-events-none select-none overflow-x-clip blur-[6px]"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Sign-in bar: pinned above the mobile bottom nav (72px), flush to the
          bottom on desktop where there is no bottom nav. */}
      <div className="fixed inset-x-0 bottom-[72px] z-40 border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_rgba(0,0,0,0.10)] backdrop-blur lg:bottom-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#F58232] sm:flex">
              <Lock className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                Sign in to view full property details
              </p>
              <p className="hidden truncate text-xs text-slate-500 sm:block">
                {description}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSignup(true)}
              className="hidden rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => setShowLogin(true)}
              className="rounded-xl bg-[#F58232] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#e67428] focus:outline-none"
            >
              Log in
            </button>
          </div>
        </div>
      </div>

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
    </>
  );
}
