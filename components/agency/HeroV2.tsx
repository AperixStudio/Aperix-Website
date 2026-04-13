"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import TypeWriter from "@/components/animations/TypeWriter";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Hero â€” Editorial word-stack style (Lineads-inspired)
   Light bg, large typographic headline, minimal copy,
   two CTAs, trust strip inline. No browser mockup.
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const HEADLINE_WORDS = ["Websites and" , "Software Solutions", "built for", "Melbourne businesses."];
const HEADLINE_TEXT = HEADLINE_WORDS.join("\n");

const SECONDARY_HEADLINE_WORDS = ["Hand coded websites,", "Fast turnaround,", "Tailored solutions."];
const SECONDARY_HEADLINE_TEXT = SECONDARY_HEADLINE_WORDS.join("\n");

const TRUST_PILLS = [
  "Custom code, no templates",
  "Melbourne-based",
  "Fast turnaround",
  "Hosted & maintained",
];

export default function HeroV2() {
  const prefersReduced = useReducedMotion();
  const headlineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;

    if (prefersReduced) {
      el.textContent = HEADLINE_TEXT;
      return;
    }

    el.textContent = "";
    const writer = new TypeWriter(el, {
      loop: true,
      typingSpeed: 65,
      deletingSpeed: 32,
    });

    writer
    //if you want to add more text use below functions and create text array at top of file under headline_text
      .typeString(HEADLINE_TEXT)
      .pauseFor(1400)
      .deleteAll()
      .pauseFor(450)

      .typeString(SECONDARY_HEADLINE_TEXT)
      .pauseFor(1400)
      .deleteAll()
      .pauseFor(450);



    return () => writer.stop();
  }, [prefersReduced]);

  return (
    <section
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-transparent px-6 pt-32 pb-20 lg:px-12"
      aria-label="Hero"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* â”€â”€ Overline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-agency-muted"
        >
          <span className="inline-block h-px w-8 bg-agency-muted" />
          Melbourne Web Studio
        </motion.p>

        {/* â”€â”€ Headline â€” word-stack â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <h1 className="font-display font-bold leading-[0.95] tracking-tight" aria-label={HEADLINE_WORDS.join(" ")}>
          <div className="h-[20lh] overflow-hidden">
            <motion.span
              initial={prefersReduced ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: prefersReduced ? 0 : 0.05,
              }}
              className="block whitespace-pre-line text-[clamp(2rem,7vw,5rem)] text-agency-ink"
              ref={headlineRef}
            />
          </div>
        </h1>

        {/* â”€â”€ Body + CTAs row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: prefersReduced ? 0 : 0.45 }}
          className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          {/* Subtext */}
          <p className="max-w-sm text-base leading-relaxed text-agency-muted sm:text-lg">
            Hand-coded, fast, and maintained. We build websites and manage online
            presence for Melbourne businesses that want to grow.
          </p>

          {/* CTAs */}
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-agency-ink px-7 py-3.5 text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-80 active:scale-[0.98]"
            >
              Book a free call
            </Link>
            <Link
              href="#tiers"
              className="inline-flex items-center justify-center rounded-lg border border-agency-border-dark px-7 py-3.5 text-sm font-semibold text-agency-ink transition-opacity duration-150 hover:opacity-60 active:scale-[0.98]"
            >
              See our work
            </Link>
          </div>
        </motion.div>

        {/* â”€â”€ Trust pills â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.6 }}
          className="mt-10 flex flex-wrap gap-2"
        >
          {TRUST_PILLS.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-agency-border bg-agency-surface px-4 py-1.5 text-xs font-medium text-agency-muted"
            >
              {pill}
            </span>
          ))}
        </motion.div>
      </div>

      {/* â”€â”€ Scroll cue â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: prefersReduced ? 0 : 1.0, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 lg:flex"
      >
        <motion.span
          animate={prefersReduced ? {} : { y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 8l5 5 5-5" stroke="var(--agency-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </motion.div>
    </section>
  );
}
