"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   AboutStrip — PRD §6.3.3
   Narrow horizontal band with 3 icon + stat combos.
   ──────────────────────────────────────────────────────────── */

const stats = [
  {
    icon: "☕",
    title: "Specialty Coffee",
    text: "Single origin, locally roasted",
  },
  {
    icon: "🥑",
    title: "Seasonal Menu",
    text: "Brunch served daily until 2:30pm",
  },
  {
    icon: "📍",
    title: "Fitzroy Local",
    text: "Serving the neighbourhood since 2019",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function AboutStrip() {
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
    <section className="bg-[#8b5e3c]">
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-10 sm:grid-cols-3 sm:gap-4 md:py-12"
        variants={stagger}
        {...motionProps}
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            variants={fadeUp}
            className="flex flex-col items-center gap-1.5 text-center"
          >
            <span className="text-2xl" aria-hidden="true">
              {stat.icon}
            </span>
            <span className="font-(family-name:--font-hs-display) text-sm font-bold text-white">
              {stat.title}
            </span>
            <span className="font-(family-name:--font-hs-body) text-xs text-white/75">
              {stat.text}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
