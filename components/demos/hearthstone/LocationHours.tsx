"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   LocationHours — PRD §6.3.7
   Two columns: map placeholder + address (left),
   hours table + contact (right).
   ──────────────────────────────────────────────────────────── */

const hours = [
  { days: "Monday – Friday", time: "7:00am – 3:00pm" },
  { days: "Saturday – Sunday", time: "7:30am – 3:30pm" },
  { days: "Public Holidays", time: "8:00am – 2:00pm" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function LocationHours() {
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
    <section id="location" className="bg-white py-20 lg:py-28">
      <motion.div
        className="mx-auto max-w-6xl px-6"
        variants={stagger}
        {...motionProps}
      >
        {/* heading */}
        <motion.div variants={fadeUp} className="mb-12 text-center">
          <h2 className="font-(family-name:--font-hs-display) text-3xl font-bold text-[#1c1612] md:text-4xl">
            Find us
          </h2>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ── left: map placeholder + address ─────────── */}
          <motion.div variants={fadeUp}>
            {/* CSS map placeholder */}
            <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-[#e8e0d5] bg-[#f0ebe3]">
              {/* grid pattern simulating map */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #e8e0d5 1px, transparent 1px), linear-gradient(to bottom, #e8e0d5 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              {/* "roads" */}
              <div
                aria-hidden="true"
                className="absolute top-1/3 right-0 left-0 h-1 bg-[#d4cfc5]"
              />
              <div
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-[#d4cfc5]"
              />
              {/* pin marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                <svg
                  width="32"
                  height="42"
                  viewBox="0 0 32 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Map pin"
                >
                  <path
                    d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26C32 7.163 24.837 0 16 0z"
                    fill="#8b5e3c"
                  />
                  <circle cx="16" cy="16" r="6" fill="white" />
                </svg>
              </div>
            </div>

            <div className="mt-5">
              <p className="font-(family-name:--font-hs-body) text-sm font-semibold text-[#1c1612]">
                123 Smith Street, Fitzroy VIC 3065
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 font-(family-name:--font-hs-body) text-sm font-medium text-[#8b5e3c] transition-colors hover:text-[#6e4a2f]"
              >
                Get Directions →
              </a>
            </div>
          </motion.div>

          {/* ── right: hours table + contact ─────────── */}
          <motion.div variants={fadeUp}>
            <h3 className="mb-4 font-(family-name:--font-hs-display) text-xl font-bold text-[#1c1612]">
              Opening Hours
            </h3>

            <table className="w-full">
              <tbody>
                {hours.map((row) => (
                  <tr key={row.days} className="border-b border-[#e8e0d5]">
                    <td className="py-3 font-(family-name:--font-hs-body) text-sm text-[#2d2520]">
                      {row.days}
                    </td>
                    <td className="py-3 text-right font-(family-name:--font-hs-mono) text-sm font-medium text-[#1c1612]">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-[#8b5e3c]"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="font-(family-name:--font-hs-body) text-sm text-[#2d2520]">
                  (03) 9XXX XXXX
                </span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-[#8b5e3c]"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a
                  href="mailto:hello@heartstonecafe.com.au"
                  className="font-(family-name:--font-hs-body) text-sm text-[#2d2520] transition-colors hover:text-[#8b5e3c]"
                >
                  hello@heartstonecafe.com.au
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
