"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   ApexHero — PRD §8.3.2
   Split hero: text left, CSS geometric clip-path amber accent right.
   ──────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ApexHero() {
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
    <section className="relative overflow-hidden bg-[#0f172a]">
      <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
        {/* left — text */}
        <motion.div
          className="flex flex-col justify-center px-6 py-20 lg:py-28"
          variants={stagger}
          {...motionProps}
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]"
          >
            Licenced Electrical Contractor · Richmond
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-(family-name:--font-apex-display) text-4xl font-bold leading-tight text-white md:text-5xl"
          >
            Melbourne&apos;s trusted sparkie — residential &amp; commercial.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-lg font-(family-name:--font-apex-body) text-base leading-relaxed text-white/70"
          >
            From switchboard upgrades to full commercial fit-outs, Apex
            Electrical delivers reliable, code-compliant electrical work across
            Melbourne. Fully licenced, $20M insured, available 24/7.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/demo/business/contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#f59e0b] px-7 py-3.5 font-(family-name:--font-apex-body) text-sm font-semibold text-[#0f172a] transition-all hover:scale-105 hover:bg-[#d97706]"
            >
              Request a Free Quote
            </Link>
            <Link
              href="/demo/business/services"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-7 py-3.5 font-(family-name:--font-apex-body) text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
            >
              Our Services
            </Link>
          </motion.div>
        </motion.div>

        {/* right — CSS geometric accent */}
        <div className="relative hidden lg:block">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#f59e0b]"
            style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
          />
          {/* inner accent */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#d97706]/40"
            style={{ clipPath: "polygon(30% 0, 100% 0, 100% 60%, 50% 100%)" }}
          />
          {/* bolt icon centred */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#0f172a]/20"
            >
              <path
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* mobile geometric accent — shows below text on small screens */}
      <div className="relative h-48 lg:hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#f59e0b]"
          style={{ clipPath: "polygon(0 20%, 100% 0, 100% 100%, 0% 100%)" }}
        />
      </div>
    </section>
  );
}
