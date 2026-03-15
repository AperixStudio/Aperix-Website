"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   ApexHero — PRD §8.3.2
   Split hero: text left, CSS geometric clip-path amber accent right.
   ──────────────────────────────────────────────────────────── */

export default function ApexHero() {
  const prefersReduced = useReducedMotion();

  const fadeUp = prefersReduced
    ? {}
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

  return (
    <section className="relative overflow-hidden bg-[#0c0a09]">
      {/* ── Grid layout ────────────────────────────────── */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-0 md:grid-cols-2">
        {/* Left — text */}
        <div className="relative z-10 px-6 py-20 md:py-28 lg:px-12">
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="mb-4 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]"
          >
            Licensed Electricians · Richmond, Melbourne
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-(family-name:--font-apex-heading) text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl"
          >
            Your local <br />
            <span className="text-[#f59e0b]">electrical</span> experts.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-md font-(family-name:--font-apex-body) text-base leading-relaxed text-white/70"
          >
            Residential, commercial &amp; emergency electrical work across
            Richmond and inner Melbourne. Fully licensed, $20M insured, 10+
            years experience.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/demo/business/contact"
              className="inline-flex items-center justify-center rounded-md bg-[#f59e0b] px-6 py-3 font-(family-name:--font-apex-body) text-sm font-semibold text-[#0c0a09] transition-all hover:scale-[1.03] hover:bg-[#d97706] active:scale-[0.97]"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:0390000000"
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 font-(family-name:--font-apex-body) text-sm font-semibold text-white transition-all hover:scale-[1.03] hover:border-white/40 hover:bg-white/5 active:scale-[0.97]"
            >
              ⚡ Call Now — (03) 9000 0000
            </a>
          </motion.div>
        </div>

        {/* Right — geometric amber accent panel */}
        <div
          className="relative hidden h-full min-h-[480px] md:block"
          aria-hidden="true"
        >
          {/* Amber clip-path panel */}
          <div
            className="absolute inset-0 bg-[#f59e0b]"
            style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
          />
          {/* Dark overlay geometric shape */}
          <div
            className="absolute inset-0 bg-[#0c0a09]/40"
            style={{
              clipPath: "polygon(55% 0, 100% 0, 100% 45%, 80% 100%, 40% 100%)",
            }}
          />
          {/* Lightning bolt motif */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="140"
              height="200"
              viewBox="0 0 140 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-20"
            >
              <polygon
                points="80,0 20,110 65,110 20,200 120,80 72,80 120,0"
                fill="#0c0a09"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
