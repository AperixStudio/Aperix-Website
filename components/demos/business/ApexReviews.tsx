"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   ApexReviews — PRD §8.3.2
   4 Google review cards: Mark D. · Rachel S. · David W. · Lisa P.
   ──────────────────────────────────────────────────────────── */

const reviews = [
  {
    text: "James and his team rewired our entire house in Fitzroy in under a week. Clean work, on time, and the quote was spot-on. Wouldn't use anyone else.",
    name: "Mark D.",
    suburb: "Fitzroy",
  },
  {
    text: "Called at 10pm on a Sunday after a power outage and they were at our door within 40 minutes. Professional, calm, and fixed the issue fast. Lifesavers.",
    name: "Rachel S.",
    suburb: "Richmond",
  },
  {
    text: "Apex handled the full electrical fit-out for our new office in Cremorne. Data cabling, lighting, the lot. Came in under budget and ahead of schedule.",
    name: "David W.",
    suburb: "Cremorne",
  },
  {
    text: "Had a switchboard upgrade done and they explained everything clearly before starting. No surprise costs, tidy work, and they even cleaned up after. Highly recommend.",
    name: "Lisa P.",
    suburb: "Hawthorn",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#f59e0b"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ApexReviews() {
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
        <motion.div variants={fadeUp} className="mb-10 text-center">
          <h2 className="inline-flex flex-wrap items-center justify-center gap-2 font-(family-name:--font-apex-display) text-2xl font-bold text-[#0f172a] md:text-3xl">
            What our customers say
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Google"
              className="inline-block"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.03 24.03 0 0 0 0 21.56l7.98-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review) => (
            <motion.div
              key={review.name}
              variants={fadeUp}
              className="rounded-xl border border-[#e2e8f0] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <Stars />
              <p className="mt-3 font-(family-name:--font-apex-body) text-sm leading-relaxed text-[#1e293b]">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-(family-name:--font-apex-body) text-sm font-semibold text-[#0f172a]">
                  {review.name}
                </span>
                <span className="font-(family-name:--font-apex-body) text-[10px] text-[#64748b]">
                  {review.suburb}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
