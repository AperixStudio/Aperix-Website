"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   TechnicalEdge (Benefits grid)
   Six-tile benefits section inspired by Lineads "Membership
   Benefits". Light bg, flat bordered cards, simple stagger.
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

interface Benefit {
  title: string;
  body: string;
  icon: React.ReactNode;
}

const BENEFITS: Benefit[] = [
  {
    title: "Fixed Monthly Rate",
    body: "One predictable fee covers design, development, hosting, and support. No invoices full of line-items.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 8h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Fast Turnaround",
    body: "Most sites are live within two weeks. We keep things moving so you're not waiting months to go online.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 6v5l3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "You Own Everything",
    body: "The code, domain, and hosting account are yours from day one. Walk away any time â€” no lock-in, ever.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="4" y="10" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "SEO Built-In",
    body: "Every site is submitted to Google Search Console and structured for rankings from the moment it's live.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15.5 15.5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 7v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Hosted & Maintained",
    body: "We handle the server, security updates, and renewals. You focus on running your business.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M4 5h14a1 1 0 0 1 1 1v4H3V6a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 10h16v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7" cy="7.5" r="1" fill="currentColor" />
        <circle cx="7" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Melbourne Based",
    body: "We're local. Meet us for coffee, call us directly, or just email â€” no offshore handoffs, no time-zone lag.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 2C7.69 2 5 4.9 5 8.5 5 13.5 11 20 11 20s6-6.5 6-11.5C17 4.9 14.31 2 11 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="11" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function TechnicalEdge() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="bg-agency-bg px-6 py-20 lg:px-12 lg:py-32"
      aria-labelledby="benefits-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 max-w-xl"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
            Why Aperix
          </p>
          <h2
            id="benefits-heading"
            className="font-display text-3xl font-bold leading-tight text-agency-ink sm:text-4xl lg:text-5xl"
          >
            What you get when you work with us.
          </h2>
        </motion.div>

        {/* â”€â”€ Grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="grid gap-px border border-agency-border bg-agency-border sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
                delay: prefersReduced ? 0 : i * 0.06,
              }}
              className="flex flex-col gap-4 bg-agency-bg p-8"
            >
              <span className="text-agency-ink">{b.icon}</span>
              <h3 className="font-display text-lg font-semibold text-agency-ink">
                {b.title}
              </h3>
              <p className="text-sm leading-relaxed text-agency-muted">{b.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
