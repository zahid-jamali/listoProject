"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  GitCompare,
  Home,
  Building2,
  BarChart3,
  Menu as MenuIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SearchResultsDropdown from "./SearchResultsDropdown";
import LoginModal from "./modals/LoginModal";
import SignupModal from "./modals/SingupModal";
import CompareModal, { readCompareList } from "./modals/CompareModal";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  getListingUrl,
  getProjectUrl,
  stashListing,
  stashProject,
} from "@/lib/listing-url";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Pre-Construction", href: "/pre-construction-projects-by-area" },
  { name: "Investors", href: "/home-and-condos-for-investment" },
  { name: "Buildings", href: "/top-condo-buildings-in-ontario" },
  { name: "Sell", href: "/sell-with-listo" },
  { name: "Exclusive", href: "/exclusive-real-estate-listings-overview" },
  { name: "Stats", href: "/real-estate-market-stats" },
];

export default function Navbar() {
  const { isLoggedIn, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const userDropdownRef = useRef(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    const updateCompare = () => setCompareCount(readCompareList().length);
    updateCompare();
    window.addEventListener("compare:updated", updateCompare);
    window.addEventListener("storage", updateCompare);
    window.addEventListener("focus", updateCompare);
    return () => {
      window.removeEventListener("compare:updated", updateCompare);
      window.removeEventListener("storage", updateCompare);
      window.removeEventListener("focus", updateCompare);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // onFocus={() => {
  //   if (results.length) setShowResults(true);
  // }}

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/main-search?q=${encodeURIComponent(query)}`,
        );

        const data = await res.json();

        setResults(data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Enter key: navigate to the best matching result (like the legacy typeahead).
  const handleSearchSubmit = () => {
    if (!results.length) return;
    const item = results[0];
    const category = item.category || "";

    setShowResults(false);
    setQuery("");

    if (item.type === "PC" || category === "PC") {
      stashProject(item);
      router.push(getProjectUrl(item));
    } else if (
      ["HOMES", "CONDOS", "ASSIGNMENT", "SOLDS", "TERMINATED"].includes(
        category,
      )
    ) {
      stashListing(item);
      router.push(getListingUrl(item));
    } else {
      // LOCATION / ADDRESS / CITY / COMMUNITY -> upstream search url
      router.push((item.access_url || "/").replace(/\?+$/, ""));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "pt-3" : "pt-4"
        } px-3 sm:px-4 md:px-6 xl:px-8`}
      >
        <div className=" mx-auto max-w-[1600px]">
          <div
            className={`mx-auto grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border transition-all duration-300 sm:rounded-3xl lg:grid-cols-[1fr_auto_1fr] ${
              scrolled
                ? "border-gray-100 bg-white/95 shadow-lg backdrop-blur-md"
                : "border-gray-100 bg-white/90 shadow-md backdrop-blur-sm"
            } px-4 py-3 sm:px-6 sm:py-4`}
          >
            {/* Logo */}
            <div className="flex items-center justify-start">
              <Link href="/" className="flex items-center">
                <img
                  src="/assets/logo.png"
                  alt="LISTO"
                  className="h-8 w-auto object-contain sm:h-9 lg:h-10 xl:h-11 2xl:h-12"
                />
              </Link>
            </div>

            {/* Desktop Navigation — centered */}
            <nav className="hidden items-center justify-center gap-1 lg:flex xl:gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 xl:px-4 ${
                    isActive(item.href)
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-[2px] left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#F36B22] to-orange-400"
                      transition={{
                        type: "spring",
                        stiffness: 900,
                        damping: 35,
                      }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 lg:gap-3">
              {/* Mobile Compare Button */}
              <button
                onClick={() => setCompareOpen(true)}
                className="relative rounded-xl p-2 transition-colors hover:bg-gray-50 lg:hidden text-gray-700"
                aria-label="Compare properties"
                title="Compare properties"
              >
                <GitCompare className="h-5 w-5" />
                {compareCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#F36B22] px-1 text-[10px] font-bold leading-none text-white shadow-sm">
                    {compareCount}
                  </span>
                )}
              </button>

              {/* Mobile Account Button */}
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    router.push("/account");
                  } else {
                    setShowLoginModal(true);
                  }
                }}
                className="rounded-xl p-2 text-gray-700 hover:bg-gray-50 transition-colors lg:hidden focus:outline-none"
                aria-label="Account"
              >
                {isLoggedIn ? (
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#F36B22] to-orange-400 text-white flex items-center justify-center font-bold text-xs shadow-sm select-none">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </button>

              {/* Mobile Top Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl p-2 text-gray-700 hover:bg-gray-50 transition-colors lg:hidden focus:outline-none"
                aria-label="Toggle menu"
              >
                <MenuIcon className="h-6 w-6" />
              </button>

              {/* Desktop Compare Button */}
              <button
                onClick={() => setCompareOpen(true)}
                className="relative hidden rounded-xl p-2 transition-colors hover:bg-gray-50 lg:block"
                aria-label="Compare properties"
                title="Compare properties"
              >
                <GitCompare className="h-5 w-5 text-gray-600" />
                {compareCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#F36B22] px-1 text-[10px] font-bold leading-none text-white shadow-sm">
                    {compareCount}
                  </span>
                )}
              </button>

              {/* Desktop User button / Dropdown */}
              <div ref={userDropdownRef} className="relative hidden lg:block">
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      setUserDropdownOpen(!userDropdownOpen);
                    } else {
                      setShowLoginModal(true);
                    }
                  }}
                  className="p-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center focus:outline-none"
                >
                  {isLoggedIn ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F36B22] to-orange-400 text-white flex items-center justify-center font-bold text-sm shadow-sm select-none">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </button>

                {/* User Dropdown Menu */}
                {isLoggedIn && userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl z-50">
                    <div className="px-4 py-2.5 border-b border-slate-50">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Signed in as
                      </p>
                      <p className="text-sm font-black text-slate-800 truncate mt-0.5">
                        {user?.name || "User"}
                      </p>
                    </div>

                    <div className="py-1.5 space-y-0.5">
                      <Link
                        href="/account?tab=postings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex w-full items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#F36B22] transition-colors"
                      >
                        My Postings
                      </Link>
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex w-full items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#F36B22] transition-colors"
                      >
                        Account
                      </Link>
                      <Link
                        href="/bookmarks"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex w-full items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#F36B22] transition-colors"
                      >
                        Bookmarks
                      </Link>
                      <Link
                        href="/bookmarks?tab=watchlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex w-full items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#F36B22] transition-colors"
                      >
                        Watchlist
                      </Link>
                      <Link
                        href="/user-property-feed"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex w-full items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#F36B22] transition-colors"
                      >
                        Feed
                      </Link>
                    </div>

                    <div className="border-t border-slate-50 pt-1.5 pb-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          toast.success("Successfully logged out");
                        }}
                        className="flex w-full items-center px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 z-[60] w-full lg:hidden px-3 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto mb-2 flex max-w-[1600px] items-stretch justify-around rounded-2xl border border-gray-100 bg-white/95 px-2 py-1.5 shadow-[0_-6px_24px_rgba(0,0,0,0.10)] backdrop-blur-md">
          <BottomNavLink
            href="/"
            icon={Home}
            label="Home"
            active={pathname === "/"}
          />
          <BottomNavLink
            href="/pre-construction-projects-by-area"
            icon={Building2}
            label="Pre-Con"
            active={pathname.startsWith("/pre-construction")}
          />

          {/* Center Compare action */}
          <button
            type="button"
            onClick={() => setCompareOpen(true)}
            aria-label="Compare properties"
            className="relative -mt-6 flex w-16 shrink-0 flex-col items-center focus:outline-none"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#F36B22] to-orange-400 text-white shadow-lg ring-4 ring-white transition-transform active:scale-95">
              <GitCompare size={22} />
              {compareCount > 0 && (
                <span className="absolute right-1 top-0 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-[#081A3A] px-1 text-[10px] font-bold leading-none text-white">
                  {compareCount}
                </span>
              )}
            </span>
            <span className="mt-1 text-[10px] font-semibold text-gray-500">
              Compare
            </span>
          </button>

          <BottomNavLink
            href="/real-estate-market-stats"
            icon={BarChart3}
            label="Stats"
            active={pathname.startsWith("/real-estate-market-stats")}
          />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
            className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-colors ${
              mobileMenuOpen ? "text-[#F36B22]" : "text-gray-500"
            }`}
          >
            <MenuIcon size={20} />
            <span className="text-[10px] font-semibold">Menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[74px] sm:top-[82px] left-3 right-3 sm:left-4 sm:right-4 z-50 lg:hidden"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[calc(100dvh-150px)] overflow-y-auto">
                {/* Mobile Search */}
                {/* <div className="p-4 border-b border-gray-100 bg-slate-50/30">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearchSubmit();
                      }}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    
                    <SearchResultsDropdown
                      query={query}
                      results={results}
                      loading={loading}
                      onClose={() => setMobileMenuOpen(false)}
                    />
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCompareOpen(true);
                    }}
                    className="mt-3 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
                  >
                    <span className="flex items-center gap-2">
                      <GitCompare className="h-5 w-5" />
                      Compare Properties
                    </span>
                    {compareCount > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F36B22] px-1.5 text-[11px] font-bold text-white">
                        {compareCount}
                      </span>
                    )}
                  </button>
                </div> */}

                {/* Mobile Navigation Links */}
                <div className="py-2">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-orange-600 bg-orange-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile Action Buttons / Account section */}
                {isLoggedIn ? (
                  <div className="border-t border-gray-100 py-4 bg-slate-50/40 px-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F36B22] to-orange-400 text-white flex items-center justify-center font-bold text-base shadow-sm select-none">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Signed in as
                        </p>
                        <p className="text-sm font-black text-slate-800">
                          {user?.name || "User"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 pl-1">
                      <Link
                        href="/account?tab=postings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex w-full items-center py-2.5 text-sm font-semibold text-slate-700 hover:text-[#F36B22]"
                      >
                        My Postings
                      </Link>
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex w-full items-center py-2.5 text-sm font-semibold text-slate-700 hover:text-[#F36B22]"
                      >
                        Account
                      </Link>
                      <Link
                        href="/bookmarks"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex w-full items-center py-2.5 text-sm font-semibold text-slate-700 hover:text-[#F36B22]"
                      >
                        Bookmarks
                      </Link>
                      <Link
                        href="/bookmarks?tab=watchlist"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex w-full items-center py-2.5 text-sm font-semibold text-slate-700 hover:text-[#F36B22]"
                      >
                        Watchlist
                      </Link>
                      <Link
                        href="/user-property-feed"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex w-full items-center py-2.5 text-sm font-semibold text-slate-700 hover:text-[#F36B22]"
                      >
                        Feed
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                          toast.success("Successfully logged out");
                        }}
                        className="flex w-full items-center py-2.5 text-sm font-bold text-red-500 hover:text-red-600 mt-2 border-t border-gray-100 pt-3"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-t border-gray-100 flex gap-3">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Account
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        signup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        login={() => {
          setShowLoginModal(true);
          setShowSignupModal(false);
        }}
      />
      <CompareModal
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
      />
    </>
  );
}

function BottomNavLink({ href, icon: Icon, label, active }) {
  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-colors ${
        active ? "text-[#F36B22]" : "text-gray-500 hover:text-[#F36B22]"
      }`}
    >
      <Icon size={20} />
      <span className="text-[10px] font-semibold">{label}</span>
    </Link>
  );
}
