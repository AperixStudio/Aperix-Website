"use client";

import { useState, useEffect, useCallback, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/our-work" },
];

function WiggleText({ label }: { label: string }) {
  return (
    <span className="agency-wiggle-word" aria-hidden="true">
      {Array.from(label).map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="agency-wiggle-letter"
          style={{ "--wiggle-index": index } as CSSProperties}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      data-cursor-pill
      aria-label={label}
      className="agency-nav-link group relative rounded-full px-4 py-2 text-sm font-medium"
    >
      <span className="transition-opacity duration-150 group-hover:opacity-0" aria-hidden="true">
        <span className="text-agency-muted">
          <WiggleText label={label} />
        </span>
      </span>
      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <span className="text-agency-ink">
          <WiggleText label={label} />
        </span>
      </span>
    </Link>
  );
}

export default function AgencyNavV2() {
  const prefersReduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          "agency-header fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 lg:px-8",
          scrolled && "agency-header--scrolled",
        )}
      >
        <div aria-hidden="true" className="agency-header-underlay" />

        <div className="relative z-10 mx-auto grid h-18 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* Logo — outside the glass pill */}
          <Link
            href="/"
            className="group flex items-center gap-2 justify-self-start"
            aria-label="Aperix — home"
          >
            <motion.span
              className="relative overflow-hidden rounded-sm transition-opacity duration-150 group-hover:opacity-90"
              animate={prefersReduced ? undefined : { rotate: 360 }}
              transition={
                prefersReduced
                  ? undefined
                  : { duration: 5, ease: "linear", repeat: Infinity }
              }
            >
              <Image
                src="/aperix-logo.svg"
                alt=""
                width={34}
                height={37}
                priority
                aria-hidden="true"
                className="h-[2.15rem] w-auto"
              />
            </motion.span>
            <span className="font-display text-lg font-bold tracking-tight text-agency-ink">
              <WiggleText label="Aperix" />
            </span>
          </Link>

          {/* Centered glass nav pill — links only */}
          <nav
            aria-label="Main navigation"
            className={cn(
              "hidden items-center rounded-full md:flex",
              "agency-glass-pill px-1.5 py-1",
              scrolled ? "opacity-100" : "agency-glass-pill--soft opacity-95",
            )}
          >
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          {/* Contact CTA + theme + mobile menu — outside the pill */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 justify-self-end">
            <Link
              href="/contact"
              data-cursor-pill
              className={cn(
                "hidden items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold md:inline-flex",
                "agency-button-primary",
                "transition-opacity duration-150 hover:opacity-90 active:scale-[0.98]",
              )}
            >
              Get in Contact
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-agency-border bg-agency-surface/80 text-agency-ink shadow-[0_10px_30px_rgba(23,23,23,0.08)] supports-backdrop-filter:backdrop-blur-xl md:hidden"
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
                  className="block h-0.5 w-full origin-center rounded-full bg-agency-ink"
                />
                <motion.span
                  animate={
                    mobileOpen
                      ? { opacity: 0, transition: { duration: dur * 0.5 } }
                      : { opacity: 1, transition: { duration: dur } }
                  }
                  className="block h-0.5 w-full rounded-full bg-agency-ink"
                />
                <motion.span
                  animate={
                    mobileOpen
                      ? { rotate: -45, y: -7, transition: { duration: dur } }
                      : { rotate: 0, y: 0, transition: { duration: dur } }
                  }
                  className="block h-0.5 w-full origin-center rounded-full bg-agency-ink"
                />
              </div>
            </button>
          </div>
        </div>
      </header>

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
            className="agency-mobile-overlay fixed inset-0 z-40 flex flex-col supports-backdrop-filter:backdrop-blur-2xl md:hidden"
          >
            <div className="agency-mobile-panel m-4 mt-24 flex flex-1 flex-col items-center justify-center gap-8 rounded-4xl px-6 shadow-[0_18px_60px_rgba(23,23,23,0.14)] supports-backdrop-filter:backdrop-blur-2xl">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    prefersReduced
                      ? { duration: 0 }
                      : { delay: 0.1 + index * 0.08, duration: 0.4, ease: "easeOut" }
                  }
                >
                  <Link
                    href={link.href}
                    onClick={closeMobile}
                    data-cursor-pill
                    aria-label={link.label}
                    className="agency-nav-link group relative font-display text-3xl font-bold"
                  >
                    <span
                      className="text-agency-ink transition-opacity duration-150 group-hover:opacity-0"
                      aria-hidden="true"
                    >
                      <WiggleText label={link.label} />
                    </span>
                    <span className="absolute inset-0 flex items-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      <span className="text-agency-muted">
                        <WiggleText label={link.label} />
                      </span>
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
              >
                <Link
                  href="/contact"
                  onClick={closeMobile}
                  data-cursor-pill
                  aria-label="Contact"
                  className="agency-nav-link group relative font-display text-3xl font-bold"
                >
                  <span
                    className="text-agency-ink transition-opacity duration-150 group-hover:opacity-0"
                    aria-hidden="true"
                  >
                    <WiggleText label="Contact" />
                  </span>
                  <span className="absolute inset-0 flex items-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <span className="text-agency-muted">
                      <WiggleText label="Contact" />
                    </span>
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { delay: 0.1 + (NAV_LINKS.length + 1) * 0.08, duration: 0.4, ease: "easeOut" }
                }
                className="pt-2"
              >
                <Link
                  href="/contact"
                  onClick={closeMobile}
                  data-cursor-pill
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold",
                    "agency-button-primary",
                    "transition-opacity duration-150 hover:opacity-90 active:scale-[0.98]",
                  )}
                >
                  Get in Contact
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
