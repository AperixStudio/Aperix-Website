"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ── add-on data ───────────────────────────────────────── */
const addOns = [
  {
    name: "Social Media Starter",
    description:
      "2 posts/week, 1 platform (Instagram or Facebook), scheduling",
    price: "$349/mo",
  },
  {
    name: "Social Media Active",
    description: "4 posts/week, 2 platforms, basic story content",
    price: "$649/mo",
  },
  {
    name: "Social Media Full",
    description:
      "Daily content, 2–3 platforms, stories + reels, engagement monitoring",
    price: "$1,190/mo",
  },
  {
    name: "Local SEO Package",
    description:
      "Google Business optimisation, citation building, reporting",
    price: "$450–$900/mo",
  },
  {
    name: "Google Ads Management",
    description: "Campaign setup, management, reporting (ad spend separate)",
    price: "$450–$900/mo",
  },
  {
    name: "Extra Revision Round",
    description: "One additional round of design or copy revisions",
    price: "$250/round",
  },
  {
    name: "Rush Delivery",
    description: "Accelerated timeline (50% faster)",
    price: "+25% project fee",
  },
  {
    name: "Photography Co-ordination",
    description:
      "Connecting client with Melbourne photographer, creative direction",
    price: "$350 flat",
  },
];

/* ── animation ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── component ─────────────────────────────────────────── */
export default function AddOnTable() {
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
    <section className="bg-agency-bg py-20 lg:py-28">
      <motion.div
        className="mx-auto max-w-5xl px-6"
        variants={stagger}
        {...motionProps}
      >
        {/* heading */}
        <motion.div variants={fadeUp} className="mb-12 text-center">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-agency-accent">
            Extras
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-agency-text md:text-4xl">
            Add-on services
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-agency-muted">
            Bolt these onto any tier. All prices are in AUD, exclusive of
            GST.
          </p>
        </motion.div>

        {/* table */}
        <motion.div
          variants={fadeUp}
          className="overflow-hidden rounded-2xl border border-agency-border"
        >
          {/* header row — desktop only */}
          <div className="hidden grid-cols-[1fr_2fr_auto] gap-4 border-b border-agency-border bg-agency-surface/60 px-6 py-4 sm:grid">
            <span className="text-xs font-semibold uppercase tracking-wider text-agency-text">
              Add-On
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-agency-text">
              Description
            </span>
            <span className="text-right text-xs font-semibold uppercase tracking-wider text-agency-text">
              Price
            </span>
          </div>

          {/* rows */}
          {addOns.map((item, i) => (
            <div
              key={item.name}
              className={
                "grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-[1fr_2fr_auto] sm:items-center sm:gap-4" +
                (i < addOns.length - 1 ? " border-b border-agency-border" : "")
              }
            >
              <span className="text-sm font-semibold text-agency-text">
                {item.name}
              </span>
              <span className="text-sm leading-relaxed text-agency-muted">
                {item.description}
              </span>
              <span className="mt-1 text-sm font-semibold text-agency-accent sm:mt-0 sm:text-right">
                {item.price}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
