"use client";

import { useState } from "react";
import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   ApexServicesPage — PRD §8.3.3
   6 services with icon, description, bullet list, quote CTA.
   Filter tabs: All · Residential · Commercial · Emergency
   ──────────────────────────────────────────────────────────── */

type Category = "All" | "Residential" | "Commercial" | "Emergency";

interface Service {
  icon: string;
  title: string;
  category: Exclude<Category, "All">;
  description: string;
  bullets: string[];
}

const services: Service[] = [
  {
    icon: "🏠",
    title: "Residential Wiring",
    category: "Residential",
    description:
      "Complete residential electrical services for Melbourne homes — from new builds to heritage terrace rewires.",
    bullets: [
      "Full house rewires & partial upgrades",
      "Switchboard upgrades & RCD installation",
      "Power point & lighting installation",
      "Ceiling fan & exhaust fan fitting",
      "Safety switch testing & compliance",
    ],
  },
  {
    icon: "🏢",
    title: "Commercial Fit-outs",
    category: "Commercial",
    description:
      "End-to-end electrical solutions for offices, retail spaces, and commercial tenancies across Melbourne.",
    bullets: [
      "New tenancy fit-outs & refurbishments",
      "Three-phase power installation",
      "Data & communications cabling",
      "Emergency & exit lighting",
      "Electrical compliance certificates",
    ],
  },
  {
    icon: "🛡️",
    title: "Safety Inspections",
    category: "Residential",
    description:
      "Protect your family and property with a thorough electrical safety inspection and written report.",
    bullets: [
      "Pre-purchase property inspections",
      "Rental & landlord safety reports",
      "Switchboard condition assessment",
      "Smoke alarm compliance checks",
      "Written certificate of compliance",
    ],
  },
  {
    icon: "🚨",
    title: "Emergency Callouts",
    category: "Emergency",
    description:
      "Power out? Sparks? Burning smell? We&apos;re available 24/7 for electrical emergencies across inner Melbourne.",
    bullets: [
      "24/7 emergency response",
      "Power outage fault-finding",
      "Tripped circuits & blown fuses",
      "Electrical fire risk assessment",
      "Rapid same-day fault repairs",
    ],
  },
  {
    icon: "☀️",
    title: "Solar & Battery Storage",
    category: "Residential",
    description:
      "Maximise your energy savings with a professionally designed solar and battery system.",
    bullets: [
      "Solar panel system design & install",
      "Battery storage (Tesla, SolarEdge, etc.)",
      "EV charger installation",
      "Grid-connect applications",
      "System monitoring & maintenance",
    ],
  },
  {
    icon: "💡",
    title: "Lighting Design",
    category: "Commercial",
    description:
      "Transform your space with professional lighting design — from accent lighting to large commercial systems.",
    bullets: [
      "LED retrofit & energy upgrades",
      "Downlight & pendant installation",
      "Outdoor & security lighting",
      "Smart lighting & dimmer systems",
      "Commercial lighting layouts",
    ],
  },
];

const tabs: Category[] = ["All", "Residential", "Commercial", "Emergency"];

export default function ApexServicesPage() {
  const [active, setActive] = useState<Category>("All");

  const filtered =
    active === "All" ? services : services.filter((s) => s.category === active);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0c0a09] py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-3 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
            Our Services
          </p>
          <h1 className="font-(family-name:--font-apex-heading) text-4xl font-extrabold text-white md:text-5xl">
            Electrical services in Richmond
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-(family-name:--font-apex-body) text-base leading-relaxed text-white/60">
            Residential, commercial, and emergency electrical work. Fully
            licensed, $20M insured, and available 24/7.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-[#111110] py-12">
        <div className="mx-auto max-w-6xl px-6">
          {/* Tab bar */}
          <div
            className="mb-10 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Service category filter"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={active === tab}
                onClick={() => setActive(tab)}
                className={`rounded-full px-5 py-2 font-(family-name:--font-apex-body) text-sm font-semibold transition-all ${
                  active === tab
                    ? "bg-[#f59e0b] text-[#0c0a09]"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Service cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(({ icon, title, category, description, bullets }) => (
              <div
                key={title}
                className="flex flex-col rounded-xl bg-white/5 p-7 ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-1 hover:ring-[#f59e0b]/40"
              >
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f59e0b]/10 text-2xl">
                    {icon}
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-[#f59e0b]/15 px-2.5 py-0.5 font-(family-name:--font-apex-body) text-xs font-semibold text-[#f59e0b]">
                      {category}
                    </span>
                    <h2 className="mt-1 font-(family-name:--font-apex-heading) text-lg font-bold text-white">
                      {title}
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 font-(family-name:--font-apex-body) text-sm leading-relaxed text-white/60">
                  {description}
                </p>

                {/* Bullets */}
                <ul className="mt-5 flex-1 space-y-2">
                  {bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 font-(family-name:--font-apex-body) text-sm text-white/70"
                    >
                      <span
                        className="mt-0.5 shrink-0 text-[#f59e0b]"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* Quote CTA */}
                <div className="mt-6">
                  <Link
                    href="/demo/business/contact"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#f59e0b]/10 px-4 py-2.5 font-(family-name:--font-apex-body) text-sm font-semibold text-[#f59e0b] ring-1 ring-[#f59e0b]/20 transition-all hover:bg-[#f59e0b] hover:text-[#0c0a09]"
                  >
                    Get a Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
