"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Guarantee() {
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.15 },
        variants: fadeUp,
        transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const },
      };

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-agency-accent/30 bg-agency-surface p-8 md:p-12"
          {...motionProps}
        >
          {/* decorative gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-agency-accent/10 blur-3xl"
          />

          <div className="relative flex flex-col items-center text-center">
            {/* shield icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-agency-accent/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-agency-accent"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-agency-text md:text-3xl">
              The 100/100 Guarantee
            </h2>

            <p className="max-w-2xl text-base leading-relaxed text-agency-muted">
              Every site we deliver scores{" "}
              <span className="font-semibold text-agency-accent">
                100/100 on Google Lighthouse
              </span>{" "}
              for Performance, Accessibility, Best Practices, and SEO. We show
              you the report on launch day. If it doesn&apos;t hit 100 in all
              four categories, we fix it for free.
            </p>

            {/* four score pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                "Performance",
                "Accessibility",
                "Best Practices",
                "SEO",
              ].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-xs font-semibold text-green-400"
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                  {label} — 100
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
