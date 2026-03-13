"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ServiceHero() {
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
    <section className="relative overflow-hidden bg-agency-bg pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* subtle radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--agency-accent)/0.06,transparent)]"
      />

      <motion.div
        className="relative mx-auto max-w-4xl px-6 text-center"
        variants={stagger}
        {...motionProps}
      >
        <motion.p
          variants={fadeUp}
          className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-agency-accent"
        >
          Services &amp; Pricing
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-display text-4xl font-bold leading-tight tracking-tight text-agency-text md:text-5xl lg:text-6xl"
        >
          What we build and how we price it.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-agency-muted"
        >
          All prices in AUD, exclusive of GST. GST of 10&percnt; applies to all
          invoices.
        </motion.p>
      </motion.div>
    </section>
  );
}
