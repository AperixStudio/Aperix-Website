"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   HearthstoneHero — PRD §6.3.2
   Full-viewport hero with warm CSS gradient, Playfair italic H1,
   two CTAs, and scroll indicator.
   ──────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function HearthstoneHero() {
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const },
      };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* warm gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-br from-[#d4a574] via-[#b5825a] to-[#8b5e3c]"
      />

      {/* subtle overlay pattern (grain) */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.08]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="hs-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hs-grain)" />
        </svg>
      </div>

      {/* dark overlay for text readability */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#1c1612]/30" />

      {/* content */}
      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-6 py-32 text-center"
        variants={stagger}
        {...motionProps}
      >
        {/* overline label */}
        <motion.p
          variants={fadeUp}
          className="mb-6 font-(family-name:--font-hs-mono) text-xs uppercase tracking-[0.25em] text-white/80"
        >
          Open Daily 7am – 3pm · Fitzroy
        </motion.p>

        {/* H1 */}
        <motion.h1
          variants={fadeUp}
          className="font-(family-name:--font-hs-display) text-4xl font-bold italic leading-tight text-white md:text-5xl lg:text-6xl"
        >
          Where Fitzroy comes for its morning ritual.
        </motion.h1>

        {/* subtext */}
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl font-(family-name:--font-hs-body) text-base leading-relaxed text-white/85 md:text-lg"
        >
          Specialty coffee, seasonal brunch menus, and a space worth lingering
          in. Find us on Smith Street.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/demo/starter/menu"
            className="inline-flex items-center justify-center rounded-lg bg-white px-7 py-3 font-(family-name:--font-hs-body) text-sm font-semibold text-[#1c1612] transition-colors hover:bg-white/90"
          >
            View Our Menu
          </Link>
          <Link
            href="/demo/starter/contact"
            className="inline-flex items-center justify-center rounded-lg border border-white/40 px-7 py-3 font-(family-name:--font-hs-body) text-sm font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10"
          >
            Get Directions
          </Link>
        </motion.div>
      </motion.div>

      {/* scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          animate={prefersReduced ? undefined : { y: [0, 8, 0] }}
          transition={
            prefersReduced
              ? undefined
              : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }
          className="flex flex-col items-center gap-2"
        >
          <span className="font-(family-name:--font-hs-mono) text-[10px] uppercase tracking-widest text-white/50">
            Scroll
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/50"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
