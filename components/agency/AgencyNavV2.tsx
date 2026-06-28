"use client";

import { useState, useEffect, useCallback, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";
import MelbourneFlipClock from "@/components/agency/MelbourneFlipClock";
import HashLink from "@/components/agency/HashLink";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "/#our-work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
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
    <HashLink
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
    </HashLink>
  );
}

function MobileMenuButton({
  open,
  onClick,
  duration,
}: {
  open: boolean;
  onClick: () => void;
  duration: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative z-50 flex size-[1.25rem] shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white shadow-[0_4px_14px_rgba(0,0,0,0.22)] supports-backdrop-filter:backdrop-blur-xl md:hidden"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      <motion.span
        className="grid grid-cols-2 gap-[2.5px]"
        aria-hidden="true"
        animate={
          open
            ? { rotate: 45, scale: 0.92, transition: { duration } }
            : { rotate: 0, scale: 1, transition: { duration } }
        }
      >
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className="size-[2.5px] rounded-full bg-white" />
        ))}
      </motion.span>
    </button>
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
    if (!mobileOpen) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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

        <div className="relative z-10 mx-auto flex h-18 max-w-6xl items-center justify-between gap-3">
          {/* Logo + mobile menu — shared text scale so menu matches cap height of “A” */}
          <div className="relative flex min-w-0 items-center gap-2 font-display text-lg leading-none">
            <Link
              href="/"
              className="group flex min-w-0 items-center gap-2"
              aria-label="Aperix — home"
            >
              <motion.span
                className="relative shrink-0 overflow-hidden rounded-sm transition-opacity duration-150 group-hover:opacity-90"
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
              <span className="truncate font-bold tracking-tight text-agency-ink">
                <WiggleText label="Aperix" />
              </span>
            </Link>

            <MobileMenuButton
              open={mobileOpen}
              onClick={() => setMobileOpen((isOpen) => !isOpen)}
              duration={dur}
            />

            <AnimatePresence>
              {mobileOpen ? (
                <>
                  <motion.button
                    type="button"
                    key="mobile-menu-backdrop"
                    className="agency-mobile-menu-backdrop fixed inset-0 z-40 md:hidden"
                    aria-label="Close menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={
                      prefersReduced ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }
                    }
                    onClick={closeMobile}
                  />

                  <motion.nav
                    key="mobile-menu-panel"
                    aria-label="Mobile navigation"
                    className="rocket-step-card fixed top-[5.35rem] left-4 z-50 w-[min(17rem,calc(100vw-2rem))] overflow-hidden rounded-xl px-5 py-2 sm:left-6 md:hidden lg:left-8"
                    initial={
                      prefersReduced
                        ? { opacity: 0 }
                        : { opacity: 0, y: -10, scale: 0.98, filter: "blur(6px)" }
                    }
                    animate={
                      prefersReduced
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                    }
                    exit={
                      prefersReduced
                        ? { opacity: 0 }
                        : { opacity: 0, y: -8, scale: 0.98, filter: "blur(4px)" }
                    }
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    {NAV_LINKS.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={
                          prefersReduced ? { opacity: 0 } : { opacity: 0, y: 14 }
                        }
                        animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                        transition={
                          prefersReduced
                            ? { duration: 0 }
                            : {
                                delay: 0.04 + index * 0.05,
                                duration: 0.34,
                                ease: [0.22, 1, 0.36, 1],
                              }
                        }
                      >
                        <HashLink
                          href={link.href}
                          onClick={closeMobile}
                          data-cursor-pill
                          className="agency-mobile-menu-link block border-b py-3.5 font-display text-xl font-semibold tracking-tight transition-opacity duration-150 last:border-b-0 hover:opacity-70 active:opacity-55"
                        >
                          {link.label}
                        </HashLink>
                      </motion.div>
                    ))}
                  </motion.nav>
                </>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Centered glass nav pill — desktop only */}
          <nav
            aria-label="Main navigation"
            className={cn(
              "absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full md:flex",
              "agency-glass-pill px-1.5 py-1",
              scrolled ? "opacity-100" : "agency-glass-pill--soft opacity-95",
            )}
          >
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          {/* Melbourne flip clock */}
          <div className="flex shrink-0 justify-end">
            <MelbourneFlipClock />
          </div>
        </div>
      </header>
    </>
  );
}
