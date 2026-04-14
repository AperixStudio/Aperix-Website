"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   HowItWorks — PRD §4.2.4
   Three-column layout with large step numbers, icons,
   headings, descriptions, and a connecting dashed line
   between steps (desktop only).
   Scroll-triggered reveals: whileInView, once: true, 0.15.
   ──────────────────────────────────────────────────────────── */

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Get in Contact",
    description:
      "Send through an enquiry and we’ll learn about your business, your customers, and what’s not working about your current online presence. You can email first, request a call, or meet in person if that suits you best.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 21V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4Z" />
        <circle cx="10" cy="13" r="1" fill="currentColor" stroke="none" />
        <circle cx="14" cy="13" r="1" fill="currentColor" stroke="none" />
        <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Design First",
    description:
      "Before any code is written, I produce a full Figma design of your site and get your sign-off. You see exactly what you’re getting before anything is built.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="22" height="22" rx="3" />
        <path d="M3 10h22" />
        <circle cx="7" cy="6.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="10.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        <path d="M8 16l3 3 5-6" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Build & Launch",
    description:
      "Your site is hand-coded for speed and SEO. We launch, I show you through everything, and your customers start finding you on Google within weeks.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 4v4M14 20v4M4 14h4M20 14h4" />
        <circle cx="14" cy="14" r="6" />
        <path d="M11 14l2 2 4-4" />
      </svg>
    ),
  },
];

/* Framer Motion variants — §3.4 */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function HowItWorks() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="px-4 py-4 sm:px-6 lg:px-8"
      aria-labelledby="hiw-heading"
    >
      <div className="agency-panel-wrap mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-32">
      {/* Section header */}
      <div className="text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
          How It Works
        </p>
        <h2
          id="hiw-heading"
          className="font-display text-3xl font-bold text-agency-ink sm:text-4xl"
        >
          Three steps to a site that works for you.
        </h2>
      </div>

      {/* Steps grid */}
      <div className="relative mx-auto mt-16 grid max-w-7xl gap-12 lg:mt-20 lg:grid-cols-3 lg:gap-0">
        {/* ── Desktop dashed connecting line (spans full width behind the cards) ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-14 left-[16.67%] right-[16.67%] hidden h-px border-t border-dashed border-agency-border lg:block"
        />

        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            variants={prefersReduced ? undefined : cardVariants}
            initial={prefersReduced ? undefined : "hidden"}
            whileInView={prefersReduced ? undefined : "visible"}
            viewport={{ once: true, amount: 0.15 }}
            transition={
              prefersReduced
                ? undefined
                : { delay: i * 0.08 }
            }
            className="relative flex flex-col items-center text-center lg:px-10"
          >
            {/* Large decorative step number */}
            <span
              aria-hidden="true"
              className="absolute -top-4 font-display text-8xl font-bold leading-none text-agency-surface2 select-none lg:-top-6 lg:text-9xl"
            >
              {step.number}
            </span>

            {/* Icon circle */}
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-agency-border-dark bg-agency-bg text-agency-ink">
              {step.icon}
            </div>

            {/* Heading */}
            <h3 className="mt-6 font-display text-xl font-semibold">
              {step.title}
            </h3>

            {/* Description */}
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-agency-muted">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
