"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/modals/LoginModal";
import SignupModal from "@/components/modals/SingupModal";
import VerifyEmailModal from "@/components/modals/VerifyEmailModal";
import { Lock, Home, Building2, X } from "lucide-react";

/**
 * AuthGate wraps protected page content.
 *
 * Requires logged-in AND email-verified. Soft-login users who have not
 * verified see the verify popup instead of locked content.
 */
export default function AuthGate({
  children,
  icon = "home",
  title = "Sign in to view this property",
  description = "Create a free account or sign in to access full listing details, price history, comparisons, and more.",
  dismissable = false,
  onClose = null,
}) {
  const { isLoggedIn, isVerified, loading, user } = useAuth();

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // While auth state is hydrating, show children normally (avoids flash)
  if (loading) {
    return <>{children}</>;
  }

  // Logged in + verified — render content normally
  if (isLoggedIn && isVerified) {
    return <>{children}</>;
  }

  // Soft session but not verified — blur + verify modal (required)
  if (isLoggedIn && !isVerified) {
    return (
      <>
        <div
          className="pointer-events-none select-none"
          style={{ filter: "blur(12px)", userSelect: "none" }}
          aria-hidden="true"
        >
          {children}
        </div>
        <VerifyEmailModal
          isOpen
          email={user?.email}
          dismissable={false}
          onClose={() => {}}
        />
      </>
    );
  }

  const GateIcon = icon === "building" ? Building2 : Home;

  return (
    <>
      {/* Blurred page content */}
      <div
        className="pointer-events-none select-none"
        style={{ filter: "blur(12px)", userSelect: "none" }}
        aria-hidden="true"
      >
        {children}
      </div>

      {mounted && typeof window !== "undefined"
        ? createPortal(
            <>
              {/* Fixed overlay */}
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-[4px] px-4">
                <div className="relative w-full max-w-md rounded-3xl bg-black/70 text-white shadow-[0_32px_80px_rgba(0,0,0,0.4)] p-8 text-center border border-white/10">
                  {dismissable && onClose && (
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors focus:outline-none"
                    >
                      <X size={18} />
                    </button>
                  )}

                  <h2 className="mt-4 text-2xl font-black text-white">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/90">{description}</p>

                  {/* CTA buttons */}
                  <div className="mt-7 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setShowLogin(true)}
                      className="w-full rounded-2xl bg-[#F58232] py-3.5 text-sm font-bold text-white transition hover:bg-[#e67428] shadow-lg shadow-orange-950/20 focus:outline-none"
                    >
                      Sign In to View
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSignup(true)}
                      className="w-full rounded-2xl border border-white/20 bg-white/5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none"
                    >
                      Create Free Account
                    </button>
                  </div>

                  <p className="mt-5 text-xs text-white/50">
                    Free to join · No credit card required
                  </p>
                </div>
              </div>

              {/* Modals */}
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
            </>,
            document.body
          )
        : null}
    </>
  );
}
