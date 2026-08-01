"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { HiBriefcase } from "react-icons/hi";


export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#0a2e2a] via-[#0e3c37] to-[#061e1b] text-slate-300 mt-5 border-t border-teal-900/50 overflow-hidden">
      {/* Decorative Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-5 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">

          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">

            <Link href="/" className="inline-flex items-center gap-2.5 text-2xl font-extrabold tracking-tight">
              {/* <span className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md">
                <HiBriefcase className="text-xl" />
              </span> */}
              <span className="bg-gradient-to-r from-teal-200 via-emerald-300 to-white bg-clip-text text-transparent">
                CareerConnect
              </span>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Connecting extraordinary talent with world-class opportunities.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-base font-semibold text-slate-200">
            <Link href="/" className="hover:text-teal-300 transition-colors duration-200">
              Home
            </Link>
            <Link href="/jobs" className="hover:text-teal-300 transition-colors duration-200">
              Browse Jobs
            </Link>
            <Link href="/companies" className="hover:text-teal-300 transition-colors duration-200">
              Companies
            </Link>
            <Link href="/about" className="hover:text-teal-300 transition-colors duration-200">
              About Us
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: FaGithub, href: "https://github.com", label: "GitHub" },
              { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
              { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
              { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
            ].map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2.5 rounded-xl bg-teal-950/70 border border-teal-800/40 text-slate-200 hover:text-teal-200 hover:bg-teal-700/50 hover:border-teal-400/60 transition-all hover:scale-110"
                >
                  <Icon className="text-base" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-teal-900/60 mt-5 pt-2 text-center text-sm font-medium text-slate-400">
          © {new Date().getFullYear()} CareerConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}