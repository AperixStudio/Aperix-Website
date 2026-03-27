"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   RecentProjects — PRD §8.3.2
   4 project cards with hover overlay effect.
   ──────────────────────────────────────────────────────────── */

const projects = [
  {
    title: "Switchboard Upgrade",
    type: "Residential",
    suburb: "Fitzroy",
    gradient: "from-[#1d4ed8] to-[#1e3a8a]",
  },
  {
    title: "Office Fit-Out",
    type: "Commercial",
    suburb: "Richmond",
    gradient: "from-[#f59e0b] to-[#d97706]",
  },
  {
    title: "Emergency Rewire",
    type: "Emergency",
    suburb: "Collingwood",
    gradient: "from-[#0f172a] to-[#1e293b]",
  },
  {
    title: "LED Lighting Install",
    type: "Residential",
    suburb: "South Yarra",
    gradient: "from-[#1d4ed8] to-[#3b82f6]",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function RecentProjects() {
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
            Recent projects
          </h2>
          <p className="mx-auto mt-3 max-w-md font-(family-name:--font-apex-body) text-base text-[#64748b]">
            A snapshot of work we&apos;ve completed across Melbourne.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={fadeUp}
              className="group relative aspect-video overflow-hidden rounded-xl"
            >
              {/* gradient placeholder */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${project.gradient}`}
              />

              {/* hover overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-[#0f172a]/0 p-6 transition-all duration-300 group-hover:bg-[#0f172a]/70">
                <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="mb-1 inline-block rounded-full bg-[#f59e0b] px-3 py-1 font-(family-name:--font-apex-body) text-[10px] font-semibold uppercase tracking-wider text-[#0f172a]">
                    {project.type}
                  </span>
                  <h3 className="font-(family-name:--font-apex-display) text-xl font-bold text-white">
                    {project.title}
                  </h3>
                  <p className="mt-1 font-(family-name:--font-apex-body) text-sm text-white/70">
                    {project.suburb}, Melbourne
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
