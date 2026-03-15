"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import TierCard from "@/components/agency/TierCard";

/* ────────────────────────────────────────────────────────────
   TierShowcase — PRD §4.2.5
   Section header + four tier pricing cards in a 2×2 grid.
   Scroll-triggered staggered reveal (§3.4).
   ──────────────────────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function TierShowcase() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="tiers"
      className="bg-agency-bg px-6 py-20 lg:px-12 lg:py-32"
      aria-labelledby="tiers-heading"
    >
      {/* ── Section header ──────────────────────────────────── */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={prefersReduced ? undefined : { duration: 0.4, ease: "easeOut" }}
          className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-accent"
        >
          Four Tiers of Work
        </motion.p>

        <motion.h2
          id="tiers-heading"
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={prefersReduced ? undefined : { duration: 0.4, ease: "easeOut", delay: 0.08 }}
          className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl"
        >
          From a single page to a full custom build.
        </motion.h2>

        <motion.p
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={prefersReduced ? undefined : { duration: 0.4, ease: "easeOut", delay: 0.16 }}
          className="mt-4 text-base leading-relaxed text-agency-muted sm:text-lg"
        >
          Every Melbourne business is different. Choose the tier that matches
          where you are and where you want to go.
        </motion.p>
      </div>

      {/* ── Cards grid (2×2 on desktop) ─────────────────────── */}
      <motion.div
        variants={prefersReduced ? undefined : containerVariants}
        initial={prefersReduced ? undefined : "hidden"}
        whileInView={prefersReduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto mt-14 grid max-w-7xl gap-8 md:grid-cols-2 lg:mt-20 lg:grid-cols-2"
      >
        {/* ── Essential ─────────────────────────────────────── */}
        <motion.div variants={prefersReduced ? undefined : cardVariants}>
          <TierCard
            name="Essential"
            color="cyan"
            price="$499"
            valueProp="Get online fast. A single-page site that puts your business on the map — literally."
            features={[
              "Single page — hero, services, contact, Google Maps",
              "Mobile-first, fully responsive",
              "Google Business Profile setup",
              "Contact form with email notification",
              "Submitted to Google Search Console",
            ]}
            retainer="From $89/month Basic Care"
            demoHref="/demo/essential"
          />
        </motion.div>

        {/* ── Starter ───────────────────────────────────────── */}
        <motion.div variants={prefersReduced ? undefined : cardVariants}>
          <TierCard
            name="Starter"
            color="cyan"
            price="$999"
            valueProp="A clean, fast, professional web presence for businesses ready to be found on Google."
            features={[
              "4–5 custom-coded pages",
              "Mobile-first, fully responsive design",
              "Google Business Profile setup & optimisation",
              "Contact form with email notification",
              "Basic on-page SEO (meta tags, structured data)",
              "Cloudflare hosting setup",
            ]}
            retainer="From $89/month Basic Care"
            demoHref="/demo/starter"
          />
        </motion.div>

        {/* ── Business (Most Popular) ───────────────────────── */}
        <motion.div variants={prefersReduced ? undefined : cardVariants}>
          <TierCard
            name="Business"
            color="amber"
            price="$1,799"
            valueProp="A conversion-focused site with everything a growing Melbourne business needs to win customers from Google."
            features={[
              "6–10 custom-coded pages",
              "Custom design system built for your brand",
              "CMS integration (Sanity) — edit your own content",
              "Booking or enquiry flow integration",
              "Full local SEO package",
              "Google Analytics + Search Console setup",
              "Core Web Vitals optimised (Lighthouse 100/100)",
              "2 rounds of revisions included",
            ]}
            retainer="From $179/month Standard Care"
            demoHref="/demo/business"
            popular
          />
        </motion.div>

        {/* ── Premium ───────────────────────────────────────── */}
        <motion.div variants={prefersReduced ? undefined : cardVariants}>
          <TierCard
            name="Premium"
            color="violet"
            price="$3,999+"
            valueProp="A bespoke, high-performance build that positions your business as the market leader in your category."
            features={[
              "Unlimited pages, full custom architecture",
              "Brand identity consultation included",
              "Advanced animations & interactions (Framer Motion)",
              "Headless CMS with full content model",
              "Custom integrations (booking, payments, portals)",
              "Advanced SEO strategy + schema markup",
              "Performance report on delivery (Lighthouse 100/100 guaranteed)",
              "Priority support, 3 months included post-launch",
            ]}
            retainer="From $349/month Growth Care"
            demoHref="/demo/premium"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
