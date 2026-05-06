"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   LuminaTreatmentsPage — PRD §9
   Animated filter pills (Framer Motion layout prop).
   8 expandable treatment cards (one open at a time).
   ──────────────────────────────────────────────────────────── */

type FilterKey = "all" | "injectables" | "skin" | "body";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "injectables", label: "Injectables" },
  { key: "skin", label: "Skin" },
  { key: "body", label: "Body" },
];

interface Treatment {
  id: string;
  name: string;
  category: string;
  filter: FilterKey[];
  price: string;
  duration: string;
  recovery: string;
  description: string;
  expect: string;
}

const treatments: Treatment[] = [
  {
    id: "anti-wrinkle",
    name: "Anti-Wrinkle Injections",
    category: "Injectables",
    filter: ["all", "injectables"],
    price: "From $350",
    duration: "30 min",
    recovery: "No downtime",
    description:
      "Muscle-relaxant injections that soften dynamic wrinkles — lines caused by repeated facial expressions. Results are natural and refreshed-looking when performed by an experienced practitioner.",
    expect:
      "A brief consultation followed by a series of tiny injections using the finest needles available. Mild redness may appear for 30 minutes. Full results visible in 10–14 days.",
  },
  {
    id: "dermal-fillers",
    name: "Dermal Fillers",
    category: "Injectables",
    filter: ["all", "injectables"],
    price: "From $650",
    duration: "45 min",
    recovery: "24–48 hr mild swelling",
    description:
      "Hyaluronic acid-based fillers restore volume and contour to lips, cheeks, under-eyes, and jawline. All products are TGA-approved and reversible.",
    expect:
      "A detailed consultation to assess facial anatomy and discuss your goals. Filler is placed via fine needle or cannula depending on the treatment area. Results are immediate.",
  },
  {
    id: "hydrafacial",
    name: "HydraFacial",
    category: "Skin Treatments",
    filter: ["all", "skin"],
    price: "From $280",
    duration: "60 min",
    recovery: "No downtime",
    description:
      "A multi-step resurfacing treatment that deep cleanses, exfoliates, extracts impurities, and delivers customised serums. Suitable for all skin types.",
    expect:
      "A relaxing treatment that leaves your skin visibly glowing immediately after. No redness or sensitivity. Regular treatments recommended every 4–6 weeks.",
  },
  {
    id: "laser-resurfacing",
    name: "Laser Skin Resurfacing",
    category: "Advanced Skin",
    filter: ["all", "skin"],
    price: "From $450",
    duration: "60–90 min",
    recovery: "3–5 days redness",
    description:
      "Fractional laser technology that stimulates collagen production and improves texture, tone, pigmentation, and fine lines. A series of treatments delivers optimal results.",
    expect:
      "Topical numbing is applied before treatment. The area will feel warm and appear red for 3–5 days. Significant improvement is visible after 2–3 treatments.",
  },
  {
    id: "body-contouring",
    name: "Body Contouring",
    category: "Body",
    filter: ["all", "body"],
    price: "From $600",
    duration: "60 min per area",
    recovery: "No downtime",
    description:
      "Non-surgical fat reduction and skin tightening using advanced energy-based devices. Targets stubborn areas that are resistant to diet and exercise.",
    expect:
      "A comfortable, non-invasive treatment. Mild warmth or pressure during the procedure. Gradual results visible over 8–12 weeks as the body eliminates treated fat cells.",
  },
  {
    id: "collagen-induction",
    name: "Collagen Induction Therapy",
    category: "Skin Treatments",
    filter: ["all", "skin"],
    price: "From $320",
    duration: "60 min",
    recovery: "24–48 hr",
    description:
      "Medical-grade micro-needling that creates controlled micro-channels in the skin to trigger the body's natural collagen and elastin production. Effective for scarring, texture, and laxity.",
    expect:
      "A topical anaesthetic is applied prior. Skin will appear pink for 24–48 hours. Downtime is minimal. Most clients see progressive improvement after 3 treatments.",
  },
  {
    id: "skin-needling",
    name: "Skin Needling",
    category: "Skin Treatments",
    filter: ["all", "skin"],
    price: "From $280",
    duration: "60 min",
    recovery: "24–48 hr",
    description:
      "A refined version of micro-needling that improves skin tone, fine lines, pore size, and overall skin quality using a medical-grade device.",
    expect:
      "Treatment takes 60 minutes including numbing time. Mild pinkness for 24–48 hours. A course of 3 treatments spaced 4 weeks apart is recommended for best results.",
  },
  {
    id: "led-therapy",
    name: "LED Light Therapy",
    category: "Skin Treatments",
    filter: ["all", "skin"],
    price: "From $150",
    duration: "45 min",
    recovery: "No downtime",
    description:
      "Non-invasive light therapy that uses specific wavelengths to target different skin concerns — red for anti-ageing, blue for acne, near-infrared for healing and inflammation.",
    expect:
      "A relaxing, painless treatment. No downtime. Can be added to other treatments or used as a stand-alone session. Regular use recommended for best results.",
  },
];

export default function LuminaTreatmentsPage() {
  const prefersReduced = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [openCard, setOpenCard] = useState<string | null>(null);

  const filtered = treatments.filter((t) =>
    t.filter.includes(activeFilter)
  );

  return (
    <main role="main">
      {/* Hero */}
      <section className="bg-[#1a1118] pb-16 pt-28 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <p className="font-(family-name:--font-lm-body) text-xs uppercase tracking-[0.2em] text-[#c9a96e]">
            Our Treatments
          </p>
          <h1 className="mt-3 font-(family-name:--font-lm-display) text-4xl font-light text-white md:text-5xl lg:text-6xl">
            Our treatments
          </h1>
          <p className="mt-3 font-(family-name:--font-lm-display) text-xl italic text-[#8b7a83]">
            Each one tailored to you.
          </p>
        </div>
      </section>

      <section className="bg-[#fdfcfb] py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-6">
          {/* Filter pills */}
          <div className="mb-10 flex flex-wrap gap-3">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                data-cursor-pill
                className={cn(
                  "relative rounded-full px-5 py-2 font-(family-name:--font-lm-body) text-sm transition-colors",
                  activeFilter === f.key
                    ? "text-[#1a1118]"
                    : "border border-[#ede5e9] text-[#8b7a83] hover:border-[#c9a96e] hover:text-[#2d2228]"
                )}
              >
                {activeFilter === f.key && (
                  <motion.span
                    layoutId="filter-bg"
                    className="absolute inset-0 rounded-full bg-[#c9a96e]"
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </div>

          {/* Treatment cards */}
          <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={prefersReduced ? undefined : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReduced ? undefined : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden rounded-xl border border-[#ede5e9] bg-white"
                >
                  {/* Closed header */}
                  <button
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                    onClick={() =>
                      setOpenCard(openCard === t.id ? null : t.id)
                    }
                    aria-expanded={openCard === t.id}
                    aria-controls={`treatment-${t.id}`}
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
                      <span className="font-(family-name:--font-lm-display) text-xl font-light text-[#1a1118]">
                        {t.name}
                      </span>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className="font-(family-name:--font-lm-body) text-[#8b7a83]">
                          {t.category}
                        </span>
                        <span className="font-(family-name:--font-lm-body) font-medium text-[#c9a96e]">
                          {t.price}
                        </span>
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: openCard === t.id ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 shrink-0 text-xl text-[#c9a96e]"
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </button>

                  {/* Expanded body */}
                  <AnimatePresence>
                    {openCard === t.id && (
                      <motion.div
                        id={`treatment-${t.id}`}
                        initial={prefersReduced ? undefined : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-[#ede5e9]"
                      >
                        <div className="grid gap-6 px-6 py-6 sm:grid-cols-3">
                          <div className="sm:col-span-2 space-y-4">
                            <p className="font-(family-name:--font-lm-body) text-sm leading-relaxed text-[#8b7a83]">
                              {t.description}
                            </p>
                            <div>
                              <p className="font-(family-name:--font-lm-body) text-xs font-medium uppercase tracking-wide text-[#2d2228]">
                                What to expect
                              </p>
                              <p className="mt-1 font-(family-name:--font-lm-body) text-sm leading-relaxed text-[#8b7a83]">
                                {t.expect}
                              </p>
                            </div>
                            <Link
                              href="/demo/premium/book"
                              className="inline-block rounded-full bg-[#c9a96e] px-5 py-2.5 font-(family-name:--font-lm-body) text-sm font-medium text-[#1a1118] transition-colors hover:bg-[#d4b87e]"
                            >
                              Book This Treatment
                            </Link>
                          </div>
                          <div className="space-y-3 rounded-xl bg-[#fdfcfb] p-5">
                            <div>
                              <p className="font-(family-name:--font-lm-body) text-[10px] uppercase tracking-widest text-[#8b7a83]">
                                Duration
                              </p>
                              <p className="font-(family-name:--font-lm-display) text-base text-[#1a1118]">
                                {t.duration}
                              </p>
                            </div>
                            <div>
                              <p className="font-(family-name:--font-lm-body) text-[10px] uppercase tracking-widest text-[#8b7a83]">
                                Recovery
                              </p>
                              <p className="font-(family-name:--font-lm-display) text-base text-[#1a1118]">
                                {t.recovery}
                              </p>
                            </div>
                            <div>
                              <p className="font-(family-name:--font-lm-body) text-[10px] uppercase tracking-widest text-[#8b7a83]">
                                Starting from
                              </p>
                              <p className="font-(family-name:--font-lm-display) text-base text-[#c9a96e]">
                                {t.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
