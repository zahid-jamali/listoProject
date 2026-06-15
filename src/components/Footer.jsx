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
    <footer className="border-t border-neutral-200 bg-[#F5F5F7]">
      <div className="mx-auto max-w-[1440px] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Logo */}
          <div>
            <Link href="/">
              <img src="/assets/logo.png" alt="LISTO" className="h-10 w-auto" />
            </Link>

            <div className="mt-6 flex gap-3">
              <SocialIcon icon={<FaFacebookF />} />
              <SocialIcon icon={<FaInstagram />} />
              <SocialIcon icon={<FaYoutube />} />
              <SocialIcon icon={<FaLinkedinIn />} />
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-[#111827]">Explore</h3>

            <div className="mt-4 space-y-3">
              <p className="text-sm text-neutral-600 leading-6">
                📍 Listo Brokerage
                <br />
                7 Eastvale Dr, Unit 2
                <br />
                Markham, ON L3S 4N8
              </p>

              <FooterLink href="/">Advertise</FooterLink>

              <FooterLink href="/">Listo Team</FooterLink>

              <FooterLink href="/">Join Listo</FooterLink>

              <FooterLink href="/">Contact Us</FooterLink>
            </div>
          </div>

          {/* Pages Column 1 */}
          <div>
            <h3 className="font-semibold text-[#111827]">Pages</h3>

            <div className="mt-4 flex flex-col gap-3">
              <FooterLink href="/new-buyers">New Buyers</FooterLink>

              <FooterLink href="/first-time-buyers">
                First Time Buyers Guide
              </FooterLink>

              <FooterLink href="/investors">Investors</FooterLink>

              <FooterLink href="/trendings">Trending</FooterLink>
              <FooterLink href="/contact-us">Contact us</FooterLink>
            </div>
          </div>

          {/* Pages Column 2 */}
          <div>
            <h3 className="opacity-0">Pages</h3>

            <div className="mt-4 flex flex-col gap-3">
              <FooterLink href="/quick-browser">Browse by Location</FooterLink>

              <FooterLink href="/faq">FAQs</FooterLink>

              <FooterLink href="/property-management">
                Property Management
              </FooterLink>

              <FooterLink href="/new-for-you">New For You</FooterLink>

              <FooterLink href="/sitemap">Sitemap</FooterLink>
            </div>
          </div>

          {/* Apps */}
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-3">
              <img
                src="/assets/google-play.png"
                alt="Google Play"
                className="h-10 w-auto"
              />

              <img
                src="/assets/app-store.png"
                alt="App Store"
                className="h-10 w-auto"
              />
            </div>

            <div className="mt-6 flex gap-8">
              <div className="text-center">
                <img src="/assets/canada-flag.png" className="h-7 mx-auto" />
                <p className="mt-2 text-sm text-neutral-700">Canada</p>
              </div>

              <div className="text-center">
                <img src="/assets/dubai-flag.png" className="h-7 mx-auto" />
                <p className="mt-2 text-sm text-neutral-700">Dubai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-neutral-300 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <p className="text-xs text-neutral-500">
              © 2026 LISTO Realty Inc. All rights reserved. MLS® data provided
              by CREA.
            </p>

            <div className="flex gap-8">
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Mail size={16} />
                info@listo.ca
              </div>

              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <PhoneCall size={16} />
                (905) 757-1234
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
