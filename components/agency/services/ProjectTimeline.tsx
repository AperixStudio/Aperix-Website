"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ── timeline phases ───────────────────────────────────── */
interface Phase {
  step: number;
  title: string;
  description: string;
  duration: string;
  owner: "Client" | "Aperix" | "Both";
}

const phases: Phase[] = [
  {
    step: 1,
    title: "Initial Contact",
    description:
      "You reach out by email or phone, and we learn about your business, goals, competitors, and ideal customers before shaping the right next step.",
    duration: "1–2 business days",
    owner: "Both",
  },
  {
    step: 2,
    title: "Proposal",
    description:
      "We send you a detailed proposal outlining scope, timeline, investment, and what success looks like.",
    duration: "1–2 business days",
    owner: "Aperix",
  },
  {
    step: 3,
    title: "Contract & Deposit",
    description:
      "You sign the agreement and pay a 50% deposit to secure your spot in our build schedule.",
    duration: "Same day",
    owner: "Client",
  },
  {
    step: 4,
    title: "Design (Figma)",
    description:
      "We create full-fidelity mockups of every page in Figma. You get to see exactly what your site will look like before a line of code is written.",
    duration: "1–2 weeks",
    owner: "Aperix",
  },
  {
    step: 5,
    title: "Design Sign-Off",
    description:
      "You review the designs, request any changes, and give final approval to move to development.",
    duration: "1–3 business days",
    owner: "Client",
  },
  {
    step: 6,
    title: "Build",
    description:
      "We build your site in Next.js with pixel-perfect fidelity to the approved design. Fully responsive, lightning fast.",
    duration: "1–4 weeks",
    owner: "Aperix",
  },
  {
    step: 7,
    title: "Staging Review",
    description:
      "You review the live staging site on a private link. Test every page, form, and interaction on your devices.",
    duration: "2–3 business days",
    owner: "Client",
  },
  {
    step: 8,
    title: "Revisions",
    description:
      "We implement your feedback from the staging review. Business tier includes 2 rounds; Premium includes 3.",
    duration: "3–5 business days",
    owner: "Aperix",
  },
  {
    step: 9,
    title: "Final Payment",
    description:
      "Once you are happy with the final build, you pay the remaining 50% balance before we go live.",
    duration: "Same day",
    owner: "Client",
  },
  {
    step: 10,
    title: "Launch",
    description:
      "We deploy to production, configure your domain, set up SSL, and submit to Google Search Console. You are live.",
    duration: "Same day",
    owner: "Aperix",
  },
  {
    step: 11,
    title: "Monthly Retainer",
    description:
      "Ongoing hosting, maintenance, security updates, uptime monitoring, and monthly content updates as needed.",
    duration: "Ongoing",
    owner: "Aperix",
  },
];

/* ── owner badge colours ───────────────────────────────── */
const ownerStyles: Record<string, string> = {
  Client:
    "bg-amber-400/10 text-amber-400 border-amber-400/20",
  Aperix:
    "bg-agency-accent/10 text-agency-accent border-agency-accent/20",
  Both:
    "bg-violet-400/10 text-violet-400 border-violet-400/20",
};

/* ── animation ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── component ─────────────────────────────────────────── */
export default function ProjectTimeline() {
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
    <section className="bg-agency-bg py-20 lg:py-28">
      <motion.div
        className="mx-auto max-w-5xl px-6"
        variants={stagger}
        {...motionProps}
      >
        {/* heading */}
        <motion.div variants={fadeUp} className="mb-14 text-center">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-agency-accent">
            How We Work Together
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-agency-text md:text-4xl">
            Your project, step by step
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-agency-muted">
            From first contact to launch day — here&apos;s exactly what happens
            and who&apos;s responsible at every stage.
          </p>
        </motion.div>

        {/* timeline */}
        <div className="relative">
          {/* vertical line */}
          <div
            aria-hidden="true"
            className="absolute left-5 top-0 bottom-0 w-px bg-agency-border md:left-1/2 md:-translate-x-px"
          />

          {phases.map((phase, i) => {
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={phase.step}
                variants={fadeUp}
                className="relative mb-10 last:mb-0 md:mb-14"
              >
                {/* dot */}
                <div
                  aria-hidden="true"
                  className="absolute left-5 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-agency-accent bg-agency-bg md:left-1/2"
                />

                {/* card — alternating sides on desktop */}
                <div
                  className={
                    "ml-12 md:ml-0 md:w-[calc(50%-2rem)] " +
                    (isLeft ? "md:mr-auto md:pr-4" : "md:ml-auto md:pl-4")
                  }
                >
                  <div className="rounded-xl border border-agency-border bg-agency-surface p-5">
                    {/* step number + title */}
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-agency-accent/10 text-xs font-bold text-agency-accent">
                        {phase.step}
                      </span>
                      <h3 className="font-display text-base font-semibold text-agency-text">
                        {phase.title}
                      </h3>
                    </div>

                    {/* description */}
                    <p className="mb-3 text-sm leading-relaxed text-agency-muted">
                      {phase.description}
                    </p>

                    {/* meta row */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-agency-surface px-3 py-1 text-xs font-medium text-agency-muted ring-1 ring-agency-border">
                        {phase.duration}
                      </span>
                      <span
                        className={
                          "rounded-full border px-3 py-1 text-xs font-medium " +
                          (ownerStyles[phase.owner] ?? "")
                        }
                      >
                        {phase.owner}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
