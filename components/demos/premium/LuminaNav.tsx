"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   LuminaNav — PRD §9.3
   Transparent → fills #1a1118/90 + blur after 80px scroll.
   Logo: LUMINA (Cormorant 300, tracked) + MED SPA (Jost xs).
   Desktop links centred: Treatments · About · FAQ · Journal · Book
   CTA: "Book a Consultation"
   Mobile: hamburger → full-height overlay slides in from RIGHT
   ──────────────────────────────────────────────────────────── */

const navLinks = [
  { label: "Treatments", href: "/demo/premium/treatments" },
  { label: "About", href: "/demo/premium/about" },
  { label: "FAQ", href: "/demo/premium/faq" },
  { label: "Journal", href: null }, // no route — shows toast
  { label: "Book", href: "/demo/premium/book" },
];

interface ToastState {
  visible: boolean;
}

export default function LuminaNav() {
  const prefersReduced = useReducedMotion();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const showToast = useCallback(() => {
    setToast({ visible: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ visible: false }), 3000);
  }, []);

  const isHome = pathname === "/demo/premium";

  return (
    <>
      {/* ── Toast ──────────────────────────────────────── */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={prefersReduced ? undefined : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
            className="fixed top-24 left-1/2 z-110 -translate-x-1/2 rounded-lg bg-[#1a1118] px-5 py-3 font-(family-name:--font-lm-body) text-sm text-white shadow-xl"
          >
            Journal coming soon.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nav ────────────────────────────────────────── */}
      <header
        role="banner"
        className={cn(
          "fixed top-(--demo-banner-h) left-0 right-0 z-40 transition-all duration-300",
          scrolled || !isHome
            ? "bg-[#1a1118]/90 backdrop-blur-md border-b border-[#c9a96e]/20"
            : "bg-transparent"
        )}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center px-6 py-4 lg:px-12"
          aria-label="Main navigation"
        >
          {/* ── Logo ─────────────────────────────── */}
          <Link
            href="/demo/premium"
            className="flex flex-col leading-none"
            aria-label="Lumina Med Spa — home"
            onClick={closeMobile}
          >
            <span className="font-(family-name:--font-lm-display) text-2xl font-light tracking-[0.3em] text-white">
              LUMINA
            </span>
            <span className="font-(family-name:--font-lm-body) text-[10px] uppercase tracking-[0.2em] text-[#c9a96e]">
              MED SPA
            </span>
          </Link>

          {/* ── Desktop links (centred) ───────────── */}
          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {navLinks.map((link) =>
              link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  data-cursor-pill
                  className={cn(
                    "relative font-(family-name:--font-lm-body) text-sm tracking-wide text-white/80 transition-colors hover:text-white",
                    pathname === link.href && "text-white"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#c9a96e]" />
                  )}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={showToast}
                  data-cursor-pill
                  className="font-(family-name:--font-lm-body) text-sm tracking-wide text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              )
            )}
          </div>

          {/* ── Desktop CTA ───────────────────────── */}
          <div className="hidden lg:block">
            <Link
              href="/demo/premium/book"
              data-cursor-pill
              className={cn(
                "rounded-full px-5 py-2 font-(family-name:--font-lm-body) text-sm font-medium transition-all",
                scrolled || !isHome
                  ? "bg-[#c9a96e] text-[#1a1118] hover:bg-[#d4b87e]"
                  : "border border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e]/10"
              )}
            >
              Book a Consultation
            </Link>
          </div>

          {/* ── Mobile hamburger ─────────────────── */}
          <button
            className="ml-auto flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span
              className={cn(
                "block h-px w-6 bg-white transition-transform duration-200",
                mobileOpen && "translate-y-1.25 rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-px w-6 bg-white transition-opacity duration-200",
                mobileOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-px w-6 bg-white transition-transform duration-200",
                mobileOpen && "-translate-y-2.25 -rotate-45"
              )}
            />
          </button>
        </nav>
      </header>

      {/* ── Mobile overlay (slides from RIGHT) ─────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={prefersReduced ? undefined : { x: "100%" }}
            animate={{ x: 0 }}
            exit={prefersReduced ? undefined : { x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-30 flex flex-col bg-[#1a1118] px-8 pt-28"
          >
            {/* close button */}
            <button
              onClick={closeMobile}
              aria-label="Close menu"
              className="absolute right-6 top-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <motion.nav
              variants={prefersReduced ? undefined : {
                visible: { transition: { staggerChildren: 0.07 } },
              }}
              initial={prefersReduced ? undefined : "hidden"}
              animate="visible"
              className="flex flex-col gap-6"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.label}
                  variants={prefersReduced ? undefined : {
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  {link.href ? (
                    <Link
                      href={link.href}
                      onClick={closeMobile}
                      data-cursor-pill
                      className="block font-(family-name:--font-lm-display) text-4xl font-light text-white hover:text-[#c9a96e]"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => { closeMobile(); showToast(); }}
                      data-cursor-pill
                      className="block font-(family-name:--font-lm-display) text-4xl font-light text-white hover:text-[#c9a96e]"
                    >
                      {link.label}
                    </button>
                  )}
                </motion.div>
              ))}
              <motion.div
                variants={prefersReduced ? undefined : {
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <Link
                  href="/demo/premium/book"
                  onClick={closeMobile}
                  data-cursor-pill
                  className="mt-4 inline-block rounded-full border border-[#c9a96e] px-6 py-3 font-(family-name:--font-lm-body) text-sm text-[#c9a96e] hover:bg-[#c9a96e]/10"
                >
                  Book a Consultation
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
