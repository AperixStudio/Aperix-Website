"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import TierDetailCard, {
  type TierDetailData,
} from "@/components/agency/services/TierDetailCard";
import { SERVICE_TIERS } from "@/lib/services-content";

const tiers: TierDetailData[] = SERVICE_TIERS.map((tier, index) => ({
  name: tier.name,
  badge: tier.badge,
  price: tier.price,
  valueProp: tier.description,
  features: tier.features,
  notIncluded: tier.notIncluded,
  timeline: tier.timeline,
  retainer: tier.retainer,
  previousTier: tier.previousTier ?? (index > 0 ? SERVICE_TIERS[index - 1]?.name : undefined),
  popular: tier.popular,
}));

/* ── animation ─────────────────────────────────────────── */
const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── component ─────────────────────────────────────────── */
export default function TierDetails() {
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.05 },
        transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const },
      };

  return (
    <section className="flex min-h-screen items-center py-14 lg:py-20">
      <motion.div
        className="mx-auto w-full max-w-450 px-6 lg:px-10 2xl:px-16"
        variants={stagger}
        {...motionProps}
      >
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
            All Four Tiers
          </p>
          <h2 className="font-display text-3xl font-bold text-agency-ink sm:text-4xl">
            Basic, Growth, Pro, and Enterprise at a glance.
          </h2>
        </div>

        <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => (
            <TierDetailCard key={tier.name} tier={tier} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
