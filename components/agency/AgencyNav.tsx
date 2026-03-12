"use client";

import { useState, useEffect, useCallback } from "react";
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
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-colors duration-300",
          scrolled
            ? "bg-agency-surface/80 backdrop-blur-lg border-b border-agency-border"
            : "bg-transparent",
        )}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12"
          aria-label="Main navigation"
        >
          {/* ── Logo ────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Aperix — home"
          >
            {/* Geometric mark */}
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-lg bg-agency-accent/20 rotate-12 transition-transform duration-150 group-hover:rotate-0" />
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
                className="relative z-10"
              >
                <path
                  d="M9 1L16.5 5.5V12.5L9 17L1.5 12.5V5.5L9 1Z"
                  stroke="var(--agency-accent)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 1V17M1.5 5.5L16.5 12.5M16.5 5.5L1.5 12.5"
                  stroke="var(--agency-accent)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  opacity="0.4"
                />
              </svg>
            </span>

            {/* Wordmark */}
            <span className="font-display text-xl font-bold tracking-tight text-agency-text">
              Aperix
            </span>
          </Link>

          {/* ── Desktop links ───────────────────────────── */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-agency-muted transition-colors duration-150 hover:text-agency-text"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium",
                "bg-agency-accent text-agency-bg",
                "transition-all duration-150 hover:brightness-90 active:scale-[0.98]",
              )}
            >
              Book a Call
            </Link>
          </div>

          {/* ── Mobile hamburger ────────────────────────── */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg md:hidden hover:bg-agency-surface transition-colors"
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
                className="block h-0.5 w-full bg-agency-text rounded-full origin-center"
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { opacity: 0, transition: { duration: dur * 0.5 } }
                    : { opacity: 1, transition: { duration: dur } }
                }
                className="block h-0.5 w-full bg-agency-text rounded-full"
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -7, transition: { duration: dur } }
                    : { rotate: 0, y: 0, transition: { duration: dur } }
                }
                className="block h-0.5 w-full bg-agency-text rounded-full origin-center"
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
            className="fixed inset-0 z-40 flex flex-col bg-agency-bg md:hidden"
          >
            {/* Push content below the nav bar height */}
            <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
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
                    className="font-display text-3xl font-bold text-agency-text hover:text-agency-accent transition-colors"
                  >
                    {link.label}
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
                    "inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium",
                    "bg-agency-accent text-agency-bg",
                    "transition-all duration-150 hover:brightness-90 active:scale-[0.98]",
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
