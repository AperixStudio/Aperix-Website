"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   ApexCTA — PRD §8.3.2
   Full-width amber CTA banner.
   ──────────────────────────────────────────────────────────── */

export default function ApexCTA() {
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 } as const,
        whileInView: { opacity: 1, y: 0 } as const,
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const },
      };

  return (
    <section className="bg-[#f59e0b]">
      <motion.div
        className="mx-auto max-w-4xl px-6 py-16 text-center lg:py-20"
        {...motionProps}
      >
        <h2 className="font-(family-name:--font-apex-display) text-3xl font-bold text-[#0f172a] md:text-4xl">
          Need an electrician you can trust?
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-(family-name:--font-apex-body) text-base text-[#0f172a]/80">
          Get a free, no-obligation quote within 24 hours. No call-out fees for
          standard jobs — guaranteed.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/demo/business/contact"
            className="inline-flex items-center justify-center rounded-lg bg-[#0f172a] px-8 py-3.5 font-(family-name:--font-apex-body) text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-[#1e293b]"
          >
            Request a Free Quote
          </Link>
          <a
            href="tel:0396001234"
            className="inline-flex items-center justify-center rounded-lg border-2 border-[#0f172a] px-8 py-3.5 font-(family-name:--font-apex-body) text-sm font-semibold text-[#0f172a] transition-all hover:bg-[#0f172a]/10"
          >
            📞 Call Now
          </a>
        </div>
      </motion.div>
    </section>
  );
}
