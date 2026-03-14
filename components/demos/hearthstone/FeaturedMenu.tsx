"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   FeaturedMenu — PRD §6.3.4
   6 menu item cards in a 2×3 grid (desktop), stacked on mobile.
   CSS gradient placeholders for food photos.
   ──────────────────────────────────────────────────────────── */

interface MenuItem {
  name: string;
  description: string;
  price: string;
  tags?: string[];
  gradient: string;
}

const menuItems: MenuItem[] = [
  {
    name: "Hearthstone Eggs Benedict",
    description: "Poached eggs, house-cured bacon, hollandaise, brioche",
    price: "$22",
    gradient: "from-[#d4a574] to-[#c49a6c]",
  },
  {
    name: "Smashed Avo & Feta",
    description: "House-baked sourdough, Persian feta, dukkah, chilli oil",
    price: "$19",
    tags: ["V"],
    gradient: "from-[#7d8a56] to-[#a8b576]",
  },
  {
    name: "Ricotta Hotcakes",
    description: "Seasonal berry compote, whipped crème fraîche, honeycomb",
    price: "$21",
    tags: ["V"],
    gradient: "from-[#c49a6c] to-[#e8c547]",
  },
  {
    name: "Single Origin Pour Over",
    description: "Ask our barista for today's origin",
    price: "$6",
    gradient: "from-[#6e4a2f] to-[#8b5e3c]",
  },
  {
    name: "Oat Milk Latte",
    description: "Our house blend with your choice of milk",
    price: "$5.50",
    tags: ["DF"],
    gradient: "from-[#c49a6c] to-[#d4a574]",
  },
  {
    name: "Cold Brew Tonic",
    description: "18-hour cold brew, tonic water, orange zest",
    price: "$7",
    tags: ["GF", "DF"],
    gradient: "from-[#8b5e3c] to-[#4a3228]",
  },
];

const tagColors: Record<string, string> = {
  V: "bg-green-100 text-green-800",
  GF: "bg-amber-100 text-amber-800",
  DF: "bg-sky-100 text-sky-800",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function FeaturedMenu() {
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
    <section id="menu" className="bg-[#faf7f2] py-20 lg:py-28">
      <motion.div
        className="mx-auto max-w-6xl px-6"
        variants={stagger}
        {...motionProps}
      >
        {/* heading */}
        <motion.div variants={fadeUp} className="mb-12 text-center">
          <h2 className="font-(family-name:--font-hs-display) text-3xl font-bold text-[#1c1612] md:text-4xl">
            What we&apos;re known for
          </h2>
          <p className="mx-auto mt-3 max-w-md font-(family-name:--font-hs-body) text-base text-[#7a6a5f]">
            Our menu changes with the seasons. Here&apos;s what&apos;s on right
            now.
          </p>
        </motion.div>

        {/* grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <motion.div
              key={item.name}
              variants={fadeUp}
              className="overflow-hidden rounded-xl border border-[#e8e0d5] bg-white"
            >
              {/* image placeholder */}
              <div
                className={`aspect-4/3 bg-linear-to-br ${item.gradient}`}
                aria-hidden="true"
              />

              {/* content */}
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-(family-name:--font-hs-display) text-lg font-bold text-[#1c1612]">
                    {item.name}
                  </h3>
                  <span className="shrink-0 font-(family-name:--font-hs-mono) text-sm font-semibold text-[#8b5e3c]">
                    {item.price}
                  </span>
                </div>

                <p className="font-(family-name:--font-hs-body) text-sm leading-relaxed text-[#7a6a5f]">
                  {item.description}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-3 flex gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${tagColors[tag] ?? ""}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
