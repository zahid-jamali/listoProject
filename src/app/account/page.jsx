"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  ShieldCheck,
  Bookmark,
  Sparkles,
  Home,
  LogOut,
  Edit2,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

function AccountContent() {
  const { user, isLoggedIn, logout, updateUser, token } = useAuth();
  const sp = useSearchParams();
  const activeTab = sp.get("tab") === "postings" ? "postings" : "profile";

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        updateUser({ name: name.trim(), phone: phone.trim() });
        setEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch {
      toast.error("Network error updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8] pb-20 pt-28 lg:pt-32">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F36B22]">
              User Portal
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#0B132B] sm:text-3xl">
              {activeTab === "postings" ? "My Postings" : "Account Settings"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your personal preferences, notifications, and property requests.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/account"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                activeTab === "profile"
                  ? "bg-[#0B132B] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#F36B22]"
              }`}
            >
              <User size={14} />
              Profile
            </Link>
            <Link
              href="/account?tab=postings"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                activeTab === "postings"
                  ? "bg-[#0B132B] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#F36B22]"
              }`}
            >
              <Home size={14} />
              My Postings
            </Link>
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <User className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Sign in to access your account
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Please log in to manage your saved properties, notifications, and profile details.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-[#F36B22] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#d95c1a]"
            >
              Go to Home
            </Link>
          </div>
        ) : activeTab === "postings" ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Property Listings & Inquiries</h2>
              <p className="mt-1 text-sm text-slate-500">
                Properties you have submitted for valuation, sale, or exclusive advertising.
              </p>

              <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <Home className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-3 text-base font-bold text-slate-700">No active postings</h3>
                <p className="mt-1 text-xs text-slate-500">
                  You haven&apos;t listed a property for sale or exclusive promotion yet.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <Link
                    href="/sell-with-listo"
                    className="rounded-full bg-[#F36B22] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#d95c1a]"
                  >
                    Sell with Listo
                  </Link>
                  <Link
                    href="/exclusive-real-estate-listings-overview"
                    className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-700 hover:border-[#F36B22]"
                  >
                    Exclusive Overview
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#F36B22] to-orange-400 text-2xl font-black text-white shadow-md">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {user?.name || "Listo Member"}
                    </h2>
                    <p className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Mail size={14} className="text-slate-400" />
                      {user?.email || "No email on file"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setName(user?.name || "");
                    setPhone(user?.phone || "");
                    setEditing(!editing);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#F36B22]"
                >
                  <Edit2 size={13} />
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSaveProfile} className="mt-8 border-t border-slate-100 pt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#F36B22]"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#F36B22]"
                        placeholder="e.g. +1 416-555-0199"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#F36B22] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#d95c1a] disabled:opacity-60"
                    >
                      <Check size={14} />
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Verification
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                      <ShieldCheck size={16} />
                      {user?.verified ? "Verified Account" : "Standard Account"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Membership Plan
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {user?.plan || "Free Access"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Quick Action
                    </p>
                    <Link
                      href="/bookmarks"
                      className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-[#F36B22] hover:underline"
                    >
                      <Bookmark size={14} />
                      View Bookmarks
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/user-property-feed"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#F36B22]"
              >
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-[#F36B22]">
                    Personalized Property Feed
                  </h3>
                  <p className="text-xs text-slate-500">
                    Latest listings matching your search history
                  </p>
                </div>
                <Sparkles className="h-5 w-5 text-[#F36B22]" />
              </Link>

              <Link
                href="/bookmarks"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#F36B22]"
              >
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-[#F36B22]">
                    Saved & Bookmarked Homes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Access your favorited properties anytime
                  </p>
                </div>
                <Bookmark className="h-5 w-5 text-[#F36B22]" />
              </Link>
            </div>

            {/* Logout button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  logout();
                  toast.success("Logged out successfully");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-50"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f6f8] pt-32 text-center text-sm text-slate-500">
          Loading account…
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
