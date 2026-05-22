"use client";

import Link from "next/link";
import { Search, Share2, User, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Pre-Construction", href: "/preconstruction" },
  { name: "Investors", href: "/investors" },
  { name: "Buildings", href: "/" },
  { name: "Sell", href: "/" },
  { name: "Exclusive", href: "/" },
  { name: "Stats", href: "/" },
];

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-4 pt-4 lg:px-6">
      <div className="mx-auto  flex h-[78px] max-w-[1400px] items-center justify-between px-4 lg:px-6 border-b   lg:container lg:mx-auto border rounded-2xl border-neutral-200 bg-white/90 backdrop-blur-md">
        {/* LEFT */}
        <div className="flex items-center gap-4 lg:gap-10">
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-700 transition-all hover:bg-neutral-100 lg:hidden"
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* LOGO */}
          <Link
            href="/"
            className="group flex items-center gap-2 transition-all"
          >
            <img
              src="/assets/logo.png"
              alt="LISTO Logo"
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* SEARCH */}
          <div className="hidden xl:flex">
            <div className="group flex h-[46px] w-[340px] items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 shadow-sm transition-all duration-300 focus-within:border-[#c47c3c] focus-within:bg-white focus-within:shadow-md">
              <Search
                size={18}
                className="text-neutral-400 transition-colors group-focus-within:text-[#c47c3c]"
              />

              <input
                type="text"
                placeholder="Search properties, investors, buildings..."
                className="w-full bg-transparent text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* CENTER NAVIGATION */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`group relative flex items-center gap-1 rounded-xl px-4 py-2 text-[14px] font-semibold transition-all duration-300 ${
                pathname === item.href
                  ? "bg-[#c47c3c]/10 text-[#c47c3c]"
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-[#c47c3c]"
              }`}
            >
              {item.name}

              {(item.name === "Buildings" || item.name === "Investors") && (
                <ChevronDown
                  size={15}
                  className="mt-[1px] transition-transform group-hover:rotate-180"
                />
              )}

              {item.name === "Home" && (
                <span className="absolute bottom-0 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-[#c47c3c]" />
              )}
            </Link>
          ))}
        </nav>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">
          {/* SEARCH MOBILE */}
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-700 transition-all hover:border-[#c47c3c] hover:text-[#c47c3c] xl:hidden">
            <Search size={18} />
          </button>

          {/* SHARE */}
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-700 transition-all hover:border-[#c47c3c] hover:bg-[#c47c3c]/5 hover:text-[#c47c3c]">
            <Share2 size={18} className="stroke-[2]" />
          </button>

          {/* USER */}
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-700 transition-all hover:border-[#c47c3c] hover:bg-[#c47c3c]/5 hover:text-[#c47c3c]">
            <User size={18} className="stroke-[2]" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`overflow-hidden border-t border-neutral-200 bg-white transition-all duration-300 lg:hidden ${
          mobileMenu ? "max-h-[500px] py-4" : "max-h-0"
        }`}
      >
        <div className="space-y-1 px-4">
          {navLinks.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                item.name === "Home"
                  ? "bg-[#c47c3c]/10 text-[#c47c3c]"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {item.name}

              {(item.name === "Buildings" || item.name === "Investors") && (
                <ChevronDown size={16} />
              )}
            </Link>
          ))}

          {/* MOBILE SEARCH */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
            <Search size={18} className="text-neutral-400" />

            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
