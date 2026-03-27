"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   TrustBadges — PRD §8.3.2
   5 trust badges in a horizontal row.
   ──────────────────────────────────────────────────────────── */

const badges = [
  { icon: "🔒", label: "Fully Licenced" },
  { icon: "🛡️", label: "$20M Insured" },
  { icon: "⚡", label: "24/7 Emergency" },
  { icon: "⭐", label: "4.9★ Google" },
  { icon: "✅", label: "Police Checked" },
];

export default function TrustBadges() {
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
    <section className="border-y border-[#e2e8f0] bg-[#f8f9fa] py-10">
      <motion.div
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-6 px-6 sm:gap-10"
        {...motionProps}
      >
        {badges.map((badge) => (
          <div key={badge.label} className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              {badge.icon}
            </span>
            <span className="font-(family-name:--font-apex-body) text-sm font-semibold text-[#1e293b]">
              {badge.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
