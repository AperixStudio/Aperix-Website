"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   WhyChooseApex — PRD §8.3.2
   4-column icon grid.
   ──────────────────────────────────────────────────────────── */

const reasons = [
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Fully Licenced & Insured",
    text: "Every job is backed by $20M public liability insurance and carried out by licenced electricians.",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "On Time, Every Time",
    text: "We respect your schedule. If we're late, the first hour is on us. That's our guarantee.",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Upfront Pricing",
    text: "No hidden costs or surprise invoices. We quote before we start and stick to it.",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1d4ed8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "24/7 Emergency",
    text: "Electrical emergencies don't wait — and neither do we. Call any time, day or night.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function WhyChooseApex() {
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
    <section className="bg-[#f8f9fa] py-20 lg:py-28">
      <motion.div
        className="mx-auto max-w-6xl px-6"
        variants={stagger}
        {...motionProps}
      >
        <motion.div variants={fadeUp} className="mb-12 text-center">
          <h2 className="font-(family-name:--font-apex-display) text-3xl font-bold text-[#0f172a] md:text-4xl">
            Why choose Apex?
          </h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={fadeUp}
              className="text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#1d4ed8]/10">
                {reason.icon}
              </div>
              <h3 className="mt-4 font-(family-name:--font-apex-display) text-base font-bold text-[#0f172a]">
                {reason.title}
              </h3>
              <p className="mt-2 font-(family-name:--font-apex-body) text-sm leading-relaxed text-[#64748b]">
                {reason.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
