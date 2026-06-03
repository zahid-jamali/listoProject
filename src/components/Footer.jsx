// src/components/layout/Footer.jsx

"use client";

import Link from "next/link";
import { Mail, PhoneCall } from "lucide-react";

import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-gradient-to-r from-white to-gray-200 ">
      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 lg:px-10">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* LEFT SIDE */}
          <div>
            {/* LOGO */}
            <Link href="/" className="inline-block">
              <img
                src="/assets/logo.png" // set your logo path
                alt="LISTO"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* DESCRIPTION */}
            <p className="mt-5 max-w-[260px] text-[14px] leading-[24px] text-neutral-500">
              Canada’s smarter way to find your next home. Powered by real MLS
              data and AI.
            </p>

            {/* SOCIAL ICONS */}
            <div className="mt-6 flex items-center gap-3">
              <SocialIcon icon={<FaFacebookF size={14} />} />
              <SocialIcon icon={<FaInstagram size={14} />} />
              <SocialIcon icon={<FaYoutube size={14} />} />
              <SocialIcon icon={<FaLinkedinIn size={14} />} />
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="text-[15px] font-bold text-black">Explore</h3>

            <div className="mt-5 flex flex-col gap-3">
              <FooterLink href="/new-buyers">Buy</FooterLink>
              <FooterLink href="/">Rent</FooterLink>
              <FooterLink href="/">Sold</FooterLink>
              <FooterLink href="/">Pre-Construction</FooterLink>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-[15px] font-bold text-black">Company</h3>

            <div className="mt-5 flex flex-col gap-3">
              <FooterLink href="/">About LISTO</FooterLink>
              <FooterLink href="/">Our Agents</FooterLink>
              <FooterLink href="/">Careers</FooterLink>
              <FooterLink href="/">Press</FooterLink>
            </div>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="text-[15px] font-bold text-black">Resources</h3>

            <div className="mt-5 flex flex-col gap-3">
              <FooterLink href="/">Market Insights</FooterLink>
              <FooterLink href="/">Mortgage</FooterLink>
              <FooterLink href="/">Calculator</FooterLink>
              <FooterLink href="/">Help Centre</FooterLink>
              <FooterLink href="/">Contact</FooterLink>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-12 border-t border-neutral-200 pt-6">
          {/* BOTTOM */}
          <div className="flex flex-col gap-5 text-center md:flex-row md:items-center md:justify-between md:text-left">
            {/* COPYRIGHT */}
            <p className="text-[12px] leading-[22px] text-neutral-400">
              © 2026 LISTO Realty Inc. All rights reserved. MLS® data provided
              by CREA.
            </p>

            {/* CONTACT */}
            <div className="flex flex-col items-center gap-4 sm:flex-row md:items-center">
              <div className="flex items-center gap-2 text-[13px] text-neutral-400">
                <Mail size={14} />
                hello@listo.ca
              </div>

              <div className="flex items-center gap-2 text-[13px] text-neutral-400">
                <PhoneCall size={14} />
                1-800-555-0199
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* SOCIAL ICON */
function SocialIcon({ icon }) {
  return (
    <button className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-500 transition-all duration-300 hover:border-[#F58233] hover:text-[#F58233] hover:shadow-md">
      {icon}
    </button>
  );
}

/* FOOTER LINK */
function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="w-fit text-[14px] text-neutral-500 transition-all duration-300 hover:text-[#F58233]"
    >
      {children}
    </Link>
  );
}
