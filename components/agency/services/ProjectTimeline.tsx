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
      "You reach out and we get a feel for the business, what you need, and where the current site or setup is falling short.",
    duration: "1–2 business days",
    owner: "Both",
  },
  {
    step: 2,
    title: "Scope & Proposal",
    description:
      "We put together the recommended scope, timeline, pricing, and a clear plan for how the project should run.",
    duration: "1–2 business days",
    owner: "Aperix",
  },
  {
    step: 3,
    title: "Rough Design & Direction",
    description:
      "Before locking anything in, we sketch out the structure, layout, and general direction so you can see how the site is taking shape. That can happen in Figma or in a coded mockup, depending on what suits the project best.",
    duration: "2–5 business days",
    owner: "Both",
  },
  {
    step: 4,
    title: "Contract & Deposit",
    description:
      "Once the direction feels right, we finalise the scope, sort the agreement, and take the deposit so the project can move into the build phase properly.",
    duration: "Same day",
    owner: "Client",
  },
  {
    step: 5,
    title: "Build",
    description:
      "We turn the approved direction into the full site, make it responsive across devices, connect the important functionality, and keep refining it as it comes together.",
    duration: "1–4 weeks",
    owner: "Aperix",
  },
  {
    step: 6,
    title: "Staging Review",
    description:
      "We send you a private staging link so you can review the site properly in a real browser and flag anything that needs adjusting.",
    duration: "2–3 business days",
    owner: "Client",
  },
  {
    step: 7,
    title: "Revisions & Polish",
    description:
      "We work through your feedback, tidy up the finer details, and get everything ready for final approval and launch.",
    duration: "3–5 business days",
    owner: "Aperix",
  },
  {
    step: 8,
    title: "Final Approval & Payment",
    description:
      "Once the finished site is approved, the final balance is paid and we line everything up for launch.",
    duration: "Same day",
    owner: "Both",
  },
  {
    step: 9,
    title: "Launch",
    description:
      "We push the site live, connect the domain, check the essentials, and make sure everything is working as expected once it is out in the world.",
    duration: "Same day",
    owner: "Aperix",
  },
  {
    step: 10,
    title: "Handover & Support",
    description:
      "Once the site is live, we help with handover, answer questions, and make sure you know how everything fits together.",
    duration: "1–3 business days",
    owner: "Both",
  },
  {
    step: 11,
    title: "Ongoing Support",
    description:
      "If you need it, we can keep looking after hosting, maintenance, updates, and general support once the site is live.",
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
    <section className="py-20 lg:py-28">
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
            From the first message through to launch, here&apos;s how the project
            usually runs and where each part sits.
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
                  className="absolute left-5 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-agency-accent bg-agency-surface md:left-1/2"
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
