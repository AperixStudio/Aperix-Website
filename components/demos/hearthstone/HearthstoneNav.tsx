"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   HearthstoneNav — PRD §6.3.1
   "HEARTHSTONE" wordmark, anchor links, Order Online toast,
   mobile hamburger with clean dropdown.
   ──────────────────────────────────────────────────────────── */

const navLinks = [
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Find Us", href: "#location" },
];

export default function HearthstoneNav() {
  const prefersReduced = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleOrderOnline = useCallback(() => {
    setToastVisible(true);
    setMobileOpen(false);
    setTimeout(() => setToastVisible(false), 4000);
  }, []);

  return (
    <>
      <nav className="sticky top-(--demo-banner-h) z-40 border-b border-[#e8e0d5] bg-[#faf7f2]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          {/* wordmark */}
          <Link href="#" className="flex flex-col leading-none">
            <span className="font-(family-name:--font-hs-display) text-lg font-bold tracking-widest text-[#1c1612]">
              HEARTHSTONE
            </span>
            <span className="font-(family-name:--font-hs-mono) text-[10px] uppercase tracking-[0.2em] text-[#7a6a5f]">
              Café · Fitzroy
            </span>
          </Link>

          {/* desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-(family-name:--font-hs-body) text-sm font-medium text-[#2d2520] transition-colors hover:text-[#8b5e3c]"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handleOrderOnline}
              className="rounded-lg bg-[#8b5e3c] px-5 py-2 font-(family-name:--font-hs-body) text-sm font-semibold text-white transition-colors hover:bg-[#6e4a2f]"
            >
              Order Online
            </button>
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
                "block h-0.5 w-5 rounded-full bg-[#1c1612] transition-transform duration-200 " +
                (mobileOpen ? "translate-y-2 rotate-45" : "")
              }
            />
            <span
              className={
                "block h-0.5 w-5 rounded-full bg-[#1c1612] transition-opacity duration-200 " +
                (mobileOpen ? "opacity-0" : "")
              }
            />
            <span
              className={
                "block h-0.5 w-5 rounded-full bg-[#1c1612] transition-transform duration-200 " +
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
              animate={prefersReduced ? undefined : { height: "auto", opacity: 1 }}
              exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[#e8e0d5] bg-[#faf7f2] md:hidden"
            >
              <div className="flex flex-col gap-1 px-5 py-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className="rounded-lg px-3 py-2.5 font-(family-name:--font-hs-body) text-sm font-medium text-[#2d2520] transition-colors hover:bg-[#e8e0d5]"
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  onClick={handleOrderOnline}
                  className="mt-2 rounded-lg bg-[#8b5e3c] px-5 py-2.5 font-(family-name:--font-hs-body) text-sm font-semibold text-white transition-colors hover:bg-[#6e4a2f]"
                >
                  Order Online
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* toast notification */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-60 max-w-sm rounded-xl border border-[#e8e0d5] bg-white px-5 py-4 shadow-lg"
          >
            <p className="font-(family-name:--font-hs-body) text-sm leading-relaxed text-[#2d2520]">
              Integrates with Square in the real build.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
