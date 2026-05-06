"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   ApexServicesPage — PRD §8.3.3
   6 services with filter tabs: All · Residential · Commercial · Emergency
   Each card: icon, description, bullet list, quote CTA.
   ──────────────────────────────────────────────────────────── */

type Category = "All" | "Residential" | "Commercial" | "Emergency";

interface Service {
  title: string;
  category: Exclude<Category, "All">;
  icon: string;
  description: string;
  features: string[];
  priceGuide: string;
}

const services: Service[] = [
  {
    title: "Switchboard Upgrades",
    category: "Residential",
    icon: "🔌",
    description:
      "Upgrade your old fuse box to a modern safety switch board. Essential for older Melbourne homes.",
    features: [
      "Replace ceramic fuses with circuit breakers",
      "Install safety switches (RCDs)",
      "Surge protection",
      "Compliance certificate issued",
    ],
    priceGuide: "From $890",
  },
  {
    title: "Home Rewiring",
    category: "Residential",
    icon: "🏠",
    description:
      "Full or partial rewiring for renovations, extensions, or ageing wiring that's a safety risk.",
    features: [
      "Full wiring assessment",
      "Concealed or surface wiring",
      "New power points and circuits",
      "Certificate of compliance",
    ],
    priceGuide: "From $3,500",
  },
  {
    title: "Commercial Fit-Outs",
    category: "Commercial",
    icon: "🏢",
    description:
      "Complete electrical solutions for offices, retail, and hospitality venues across Melbourne.",
    features: [
      "Lighting design and installation",
      "Data and communications cabling",
      "Three-phase power",
      "Exit and emergency lighting",
    ],
    priceGuide: "Quote required",
  },
  {
    title: "Data & Communications",
    category: "Commercial",
    icon: "📡",
    description:
      "Structured data cabling, server room setup, and network infrastructure for businesses.",
    features: [
      "Cat6/Cat6a cabling",
      "Patch panel and rack setup",
      "WiFi access point installation",
      "Cable certification and testing",
    ],
    priceGuide: "From $150/point",
  },
  {
    title: "Emergency Call-Outs",
    category: "Emergency",
    icon: "🚨",
    description:
      "Power outages, sparking outlets, burning smells, tripped safety switches — we respond fast, 24/7.",
    features: [
      "Average 45-minute response time",
      "Fault finding and isolation",
      "Temporary power restoration",
      "Permanent repair scheduled",
    ],
    priceGuide: "From $180 call-out",
  },
  {
    title: "Safety Inspections",
    category: "Residential",
    icon: "🔍",
    description:
      "Pre-purchase, rental, or periodic safety inspections to ensure your property meets current standards.",
    features: [
      "Full electrical safety audit",
      "Thermal imaging scan",
      "Detailed report with photos",
      "Priority remediation if needed",
    ],
    priceGuide: "From $280",
  },
];

const tabs: Category[] = ["All", "Residential", "Commercial", "Emergency"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ApexServicesPage() {
  const prefersReduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState<Category>("All");

  const filtered =
    activeTab === "All"
      ? services
      : services.filter((s) => s.category === activeTab);

  const motionProps = prefersReduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.1 },
        transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const },
      };

  return (
    <>
      {/* hero */}
      <section className="bg-[#0f172a] py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="mb-3 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
            Our Services
          </p>
          <h1 className="font-(family-name:--font-apex-display) text-3xl font-bold text-white md:text-4xl">
            Electrical services for every need
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-(family-name:--font-apex-body) text-base text-white/70">
            From a single power point to a full commercial fit-out — we handle
            it all.
          </p>
        </div>
      </section>

      {/* filter tabs + cards */}
      <section className="bg-[#f8f9fa] py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          {/* tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                data-cursor-pill
                className={`rounded-lg px-5 py-2.5 font-(family-name:--font-apex-body) text-sm font-semibold transition-all hover:scale-105 ${
                  activeTab === tab
                    ? "bg-[#1d4ed8] text-white"
                    : "border border-[#e2e8f0] bg-white text-[#1e293b] hover:border-[#1d4ed8]/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* service cards */}
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={stagger}
            {...motionProps}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((service) => (
                <motion.div
                  key={service.title}
                  layout={!prefersReduced}
                  variants={fadeUp}
                  initial={prefersReduced ? undefined : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReduced ? undefined : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col rounded-xl border border-[#e2e8f0] bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl" aria-hidden="true">
                      {service.icon}
                    </span>
                    <span className="rounded-full bg-[#1d4ed8]/10 px-3 py-1 font-(family-name:--font-apex-body) text-[10px] font-semibold uppercase tracking-wider text-[#1d4ed8]">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="mt-4 font-(family-name:--font-apex-display) text-xl font-bold text-[#0f172a]">
                    {service.title}
                  </h3>

                  <p className="mt-2 font-(family-name:--font-apex-body) text-sm leading-relaxed text-[#64748b]">
                    {service.description}
                  </p>

                  <ul className="mt-4 flex-1 space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 font-(family-name:--font-apex-body) text-sm text-[#1e293b]"
                      >
                        <span className="mt-0.5 text-[#1d4ed8]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center justify-between border-t border-[#e2e8f0] pt-4">
                    <span className="font-(family-name:--font-apex-body) text-sm font-bold text-[#0f172a]">
                      {service.priceGuide}
                    </span>
                    <Link
                      href="/demo/business/contact"
                      className="font-(family-name:--font-apex-body) text-sm font-semibold text-[#1d4ed8] transition-colors hover:text-[#1e3a8a]"
                    >
                      Get a Quote →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* pricing disclaimer */}
          <p className="mt-10 text-center font-(family-name:--font-apex-body) text-xs text-[#64748b]">
            All prices are indicative guides only. Final pricing depends on
            scope, site conditions, and materials. We provide a fixed quote
            before any work begins.
          </p>
        </div>
      </section>
    </>
  );
}
