"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   AgencyNav — PRD §4.2.1
   Fixed/sticky top navigation for the Agency Shell.
   • Logo left: "Aperix" wordmark + geometric mark
   • Nav links right: Services, Our Work, Pricing, Contact
   • Scroll-past-hero → bg fills with --agency-surface + blur
   • Mobile: hamburger → full-screen slide-in overlay
   • CTA: "Book a Call" → /contact
   ──────────────────────────────────────────────────────────── */

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/#tiers" },
  { label: "Pricing", href: "/#tiers" },
  { label: "Contact", href: "/contact" },
];

export default function AgencyNav() {
  const prefersReduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ── scroll listener ──────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── lock body scroll when mobile menu open ───────────── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const dur = prefersReduced ? 0 : 0.15;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
        {/* Glass pill backplate — tighter and more distinct */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-1/2 top-4 h-18 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 rounded-full border shadow-[0_18px_60px_rgba(67,92,122,0.14)] supports-backdrop-filter:backdrop-blur-2xl sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)] transition-all duration-300",
            scrolled
              ? "border-white/42 bg-white/34 opacity-100"
              : "border-white/28 bg-white/20 opacity-95",
          )}
        />
        <nav
          className="relative mx-auto flex h-18 max-w-6xl items-center justify-between rounded-full px-6 py-0 lg:px-8"
          aria-label="Main navigation"
        >
          {/* ── Logo ────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Aperix — home"
          >
            <span className="relative overflow-hidden rounded-sm transition-opacity duration-150 group-hover:opacity-90">
              <Image
                src="/aperix-logo.svg"
                alt=""
                width={34}
                height={37}
                priority
                aria-hidden="true"
                className="h-[2.15rem] w-auto"
              />
            </span>

            {/* Wordmark */}
            <span className="font-display text-lg font-bold tracking-tight text-agency-ink">
              Aperix
            </span>
          </Link>

          {/* ── Desktop links ───────────────────────────── */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative text-sm font-medium"
              >
                {/* muted layer — fades out on hover */}
                <span className="transition-opacity duration-150 group-hover:opacity-0" aria-hidden="true">
                  <span className="text-agency-muted">{link.label}</span>
                </span>
                {/* ink layer — fades in on hover */}
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <span className="text-agency-ink">{link.label}</span>
                </span>
              </Link>
            ))}

            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold",
                "bg-agency-ink/92 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
                "transition-opacity duration-150 hover:opacity-90 active:scale-[0.98]",
              )}
            >
              Book a Call
            </Link>
          </div>

          {/* ── Mobile hamburger ────────────────────────── */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/28 shadow-[0_10px_30px_rgba(67,92,122,0.12)] supports-backdrop-filter:backdrop-blur-xl md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <div className="flex w-5 flex-col gap-1.25">
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 7, transition: { duration: dur } }
                    : { rotate: 0, y: 0, transition: { duration: dur } }
                }
                className="block h-0.5 w-full bg-agency-ink rounded-full origin-center"
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { opacity: 0, transition: { duration: dur * 0.5 } }
                    : { opacity: 1, transition: { duration: dur } }
                }
                className="block h-0.5 w-full bg-agency-ink rounded-full"
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -7, transition: { duration: dur } }
                    : { rotate: 0, y: 0, transition: { duration: dur } }
                }
                className="block h-0.5 w-full bg-agency-ink rounded-full origin-center"
              />
            </div>
          </button>
        </nav>
      </header>

      {/* ── Mobile overlay ──────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { duration: 0.3, ease: "easeOut" }
            }
            className="fixed inset-0 z-40 flex flex-col bg-[rgba(232,238,245,0.72)] supports-backdrop-filter:backdrop-blur-2xl md:hidden"
          >
            {/* Push content below the nav bar height */}
            <div className="m-4 flex flex-1 flex-col items-center justify-center gap-8 rounded-4xl border border-white/45 bg-white/38 px-6 shadow-[0_18px_60px_rgba(67,92,122,0.14)] supports-backdrop-filter:backdrop-blur-2xl">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    prefersReduced
                      ? { duration: 0 }
                      : { delay: 0.1 + i * 0.08, duration: 0.4, ease: "easeOut" }
                  }
                >
                  <Link
                    href={link.href}
                    onClick={closeMobile}
                    className="group relative font-display text-3xl font-bold"
                  >
                    {/* base layer */}
                    <span className="text-agency-ink transition-opacity duration-150 group-hover:opacity-0" aria-hidden="true">
                      {link.label}
                    </span>
                    {/* muted layer — fades in on hover */}
                    <span className="absolute inset-0 flex items-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      <span className="text-agency-muted">{link.label}</span>
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { delay: 0.1 + NAV_LINKS.length * 0.08, duration: 0.4, ease: "easeOut" }
                }
                className="pt-4"
              >
                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold",
                    "bg-agency-ink/92 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
                    "transition-opacity duration-150 hover:opacity-90 active:scale-[0.98]",
                  )}
                >
                  Book a Call
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
