"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   ApexNav — PRD §8.3.1
   Utility bar (phone · email · 24/7 Emergency) + main nav.
   Logo: "APEX ELECTRICAL" with amber lightning bolt SVG.
   Nav: Home · Services · About · Contact.
   CTA: "Request a Quote" (amber).
   Mobile: full-width slide-down menu.
   ──────────────────────────────────────────────────────────── */

const navLinks = [
  { label: "Home", href: "/demo/business" },
  { label: "Services", href: "/demo/business/services" },
  { label: "About", href: "/demo/business/about" },
  { label: "Contact", href: "/demo/business/contact" },
];

export default function ApexNav() {
  const prefersReduced = useReducedMotion();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* ── Utility Bar ──────────────────────────────── */}
      <div className="bg-[#0f172a] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-2 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="tel:0396001234"
              className="font-(family-name:--font-apex-body) text-white/70 transition-colors hover:text-white"
            >
              📞 (03) 9600 1234
            </a>
            <a
              href="mailto:info@apexelectrical.com.au"
              className="hidden font-(family-name:--font-apex-body) text-white/70 transition-colors hover:text-white sm:inline"
            >
              ✉️ info@apexelectrical.com.au
            </a>
          </div>
          <span className="font-(family-name:--font-apex-body) font-semibold text-[#f59e0b]">
            ⚡ 24/7 Emergency Service Available
          </span>
        </div>
      </div>

      {/* ── Main Nav ─────────────────────────────────── */}
      <nav className="sticky top-(--demo-banner-h) z-40 border-b border-[#e2e8f0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          {/* logo */}
          <Link
            href="/demo/business"
            className="flex items-center gap-2"
            onClick={closeMobile}
          >
            {/* lightning bolt SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                fill="#f59e0b"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-(family-name:--font-apex-display) text-lg font-bold tracking-wide text-[#0f172a]">
              APEX ELECTRICAL
            </span>
          </Link>

          {/* desktop links */}
          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/demo/business"
                  ? pathname === "/demo/business"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-(family-name:--font-apex-body) text-sm font-medium transition-colors hover:text-[#1d4ed8] ${
                    isActive ? "text-[#1d4ed8]" : "text-[#1e293b]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/demo/business/contact"
              className="rounded-lg bg-[#f59e0b] px-5 py-2.5 font-(family-name:--font-apex-body) text-sm font-semibold text-[#0f172a] transition-all hover:scale-105 hover:bg-[#d97706]"
            >
              Request a Quote
            </Link>
          </div>

          {/* mobile hamburger */}
          <button
            onClick={toggleMobile}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={
                "block h-0.5 w-5 rounded-full bg-[#0f172a] transition-transform duration-200 " +
                (mobileOpen ? "translate-y-2 rotate-45" : "")
              }
            />
            <span
              className={
                "block h-0.5 w-5 rounded-full bg-[#0f172a] transition-opacity duration-200 " +
                (mobileOpen ? "opacity-0" : "")
              }
            />
            <span
              className={
                "block h-0.5 w-5 rounded-full bg-[#0f172a] transition-transform duration-200 " +
                (mobileOpen ? "-translate-y-2 -rotate-45" : "")
              }
            />
          </button>
        </div>

        {/* mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={prefersReduced ? undefined : { height: 0, opacity: 0 }}
              animate={
                prefersReduced ? undefined : { height: "auto", opacity: 1 }
              }
              exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[#e2e8f0] bg-white md:hidden"
            >
              <div className="flex flex-col gap-1 px-5 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className="rounded-lg px-3 py-2.5 font-(family-name:--font-apex-body) text-sm font-medium text-[#1e293b] transition-colors hover:bg-[#f8f9fa]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/demo/business/contact"
                  onClick={closeMobile}
                  className="mt-2 rounded-lg bg-[#f59e0b] px-5 py-2.5 text-center font-(family-name:--font-apex-body) text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#d97706]"
                >
                  Request a Quote
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
