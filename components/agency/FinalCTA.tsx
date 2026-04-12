"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   FinalCTA — PRD §4.2.8
   Full-width cyan background. Dark text.
   H2, subtext, large primary button → /contact,
   "Based in Melbourne · Serving all of Victoria" below.
   Scroll-triggered fade-up reveal.
   ──────────────────────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function FinalCTA() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="px-4 py-4 sm:px-6 lg:px-8"
      aria-labelledby="final-cta-heading"
    >
      <motion.div
        variants={prefersReduced ? undefined : containerVariants}
        initial={prefersReduced ? undefined : "hidden"}
        whileInView={prefersReduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
        className="agency-panel-dark-wrap mx-auto max-w-5xl px-6 py-20 text-center sm:px-8 lg:px-12 lg:py-24"
      >
        {/* H2 */}
        <motion.h2
          id="final-cta-heading"
          variants={prefersReduced ? undefined : fadeUp}
          className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
        >
          Ready to stop losing customers to a bad&nbsp;website?
        </motion.h2>

        {/* Subtext */}
        <motion.p
          variants={prefersReduced ? undefined : fadeUp}
          className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg"
        >
          Book a free 20-minute discovery call. No obligation&nbsp;&mdash; just
          an honest look at what&rsquo;s possible for your business.
        </motion.p>

        {/* CTA button */}
        <motion.div variants={prefersReduced ? undefined : fadeUp} className="mt-8">
          <Link
            href="/contact"
            className={cn(
              "inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold",
              "bg-white text-agency-ink",
              "transition-opacity duration-150 hover:opacity-85 active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-agency-ink",
            )}
          >
            Book a Free Call
          </Link>
        </motion.div>

        {/* Location line */}
        <motion.p
          variants={prefersReduced ? undefined : fadeUp}
          className="mt-6 text-sm text-white/50"
        >
          Based in Melbourne · Serving all of Victoria
        </motion.p>
      </motion.div>
    </section>
  );
}
