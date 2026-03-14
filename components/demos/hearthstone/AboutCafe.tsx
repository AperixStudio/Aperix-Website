"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   AboutCafe — PRD §6.3.5
   Two-column: left text, right stacked image placeholders with
   "Est. 2019" badge.
   ──────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function AboutCafe() {
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
    <section id="about" className="bg-white py-20 lg:py-28">
      <motion.div
        className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-16"
        variants={stagger}
        {...motionProps}
      >
        {/* left column — text */}
        <motion.div variants={fadeUp} className="flex flex-col justify-center">
          <p className="mb-3 font-(family-name:--font-hs-mono) text-xs uppercase tracking-[0.2em] text-[#8b5e3c]">
            Our Story
          </p>
          <h2 className="font-(family-name:--font-hs-display) text-3xl font-bold text-[#1c1612] md:text-4xl">
            A spot worth the walk.
          </h2>

          <div className="mt-6 space-y-4 font-(family-name:--font-hs-body) text-base leading-relaxed text-[#7a6a5f]">
            <p>
              Hearthstone started the way most good cafés do — with a love of
              great coffee and a belief that the neighbourhood deserved better
              than what was on offer. We opened our doors on Smith Street in
              2019 with a simple plan: serve outstanding coffee, cook honest
              food, and create a space people actually want to stay in.
            </p>
            <p>
              Our beans are sourced from a single-origin roaster just down the
              road in Collingwood. The menu changes with the seasons because
              we believe the best food follows what&apos;s fresh — not what&apos;s
              cheapest. And we keep our kitchen open until 2:30pm because
              brunch in Fitzroy shouldn&apos;t feel rushed.
            </p>
            <p>
              We&apos;re not trying to be everything to everyone. Just a good
              café for the people who live, work, and wander through Fitzroy.
              If you haven&apos;t been yet, come say hello. The baristas will
              probably remember your order by the third visit.
            </p>
          </div>
        </motion.div>

        {/* right column — image placeholders */}
        <motion.div
          variants={fadeUp}
          className="relative flex flex-col gap-4"
        >
          {/* top image placeholder */}
          <div className="aspect-4/3 overflow-hidden rounded-xl bg-linear-to-br from-[#c49a6c] to-[#8b5e3c]">
            <div className="flex h-full items-center justify-center">
              <span className="font-(family-name:--font-hs-mono) text-xs uppercase tracking-widest text-white/40">
                Interior photo
              </span>
            </div>
          </div>

          {/* bottom image placeholder */}
          <div className="aspect-4/3 overflow-hidden rounded-xl bg-linear-to-br from-[#d4a574] to-[#c49a6c]">
            <div className="flex h-full items-center justify-center">
              <span className="font-(family-name:--font-hs-mono) text-xs uppercase tracking-widest text-white/40">
                Coffee prep photo
              </span>
            </div>
          </div>

          {/* Est. 2019 badge */}
          <div className="absolute -bottom-3 -right-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#1c1612] shadow-lg lg:-right-6 lg:-bottom-6">
            <div className="text-center">
              <span className="block font-(family-name:--font-hs-mono) text-[9px] uppercase tracking-wider text-[#c49a6c]">
                Est.
              </span>
              <span className="block font-(family-name:--font-hs-display) text-lg font-bold text-white">
                2019
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
