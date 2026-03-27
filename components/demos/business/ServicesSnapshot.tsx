"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   ServicesSnapshot — PRD §8.3.2
   3 service cards with hover lift → /demo/business/services
   ──────────────────────────────────────────────────────────── */

const services = [
  {
    icon: "🏠",
    title: "Residential",
    description:
      "Switchboard upgrades, safety inspections, lighting, and rewiring for homes across Melbourne.",
  },
  {
    icon: "🏢",
    title: "Commercial",
    description:
      "Office fit-outs, data cabling, emergency lighting, and compliance testing for businesses.",
  },
  {
    icon: "⚡",
    title: "Emergency",
    description:
      "24/7 emergency call-outs for power outages, electrical faults, and safety hazards.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ServicesSnapshot() {
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
    <section className="bg-white py-20 lg:py-28">
      <motion.div
        className="mx-auto max-w-6xl px-6"
        variants={stagger}
        {...motionProps}
      >
        <motion.div variants={fadeUp} className="mb-12 text-center">
          <h2 className="font-(family-name:--font-apex-display) text-3xl font-bold text-[#0f172a] md:text-4xl">
            What we do
          </h2>
          <p className="mx-auto mt-3 max-w-md font-(family-name:--font-apex-body) text-base text-[#64748b]">
            Comprehensive electrical services for homes and businesses across
            Melbourne.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={fadeUp}
              className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fa] p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-3xl" aria-hidden="true">
                {service.icon}
              </span>
              <h3 className="mt-4 font-(family-name:--font-apex-display) text-xl font-bold text-[#0f172a]">
                {service.title}
              </h3>
              <p className="mt-3 font-(family-name:--font-apex-body) text-sm leading-relaxed text-[#64748b]">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-10 text-center">
          <Link
            href="/demo/business/services"
            className="inline-flex items-center gap-1 font-(family-name:--font-apex-body) text-sm font-semibold text-[#1d4ed8] transition-colors hover:text-[#1e3a8a]"
          >
            View All Services →
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
