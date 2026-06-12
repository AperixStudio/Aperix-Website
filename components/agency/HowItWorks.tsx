"use client";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations";

/* ────────────────────────────────────────────────────────────
   HowItWorks — PRD §4.2.4
   Three-column layout with large step numbers, icons,
   headings, descriptions, and a connecting dashed line
   between steps (desktop only).
   Scroll-triggered reveals: whileInView, once: true, ROCKET_HOW_IT_WORKS_IMPLEMENTATION_BRIEF.md0.15.
   ──────────────────────────────────────────────────────────── */

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Start the Conversation",
    description:
      "You send through a brief and we talk through the business, the goals, and what the site needs to do. You get a direct point of contact, a clear scope, and a straightforward next step before any work begins.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 21V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4Z" />
        <circle cx="10" cy="13" r="1" fill="currentColor" stroke="none" />
        <circle cx="14" cy="13" r="1" fill="currentColor" stroke="none" />
        <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Shape the Direction",
    description:
      "We map out the page structure, content flow, and visual direction with you before the build gets underway. Depending on the project, that might be a Figma concept or a working draft in code so we can test the ideas properly.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="22" height="22" rx="3" />
        <path d="M3 10h22" />
        <circle cx="7" cy="6.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="10.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        <path d="M8 16l3 3 5-6" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Build, Refine & Launch",
    description:
      "Once the direction feels right, we build the site, test it across devices, refine the details, and get it live. You also get handover support so the launch feels smooth and the site is ready to use from day one.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 4v4M14 20v4M4 14h4M20 14h4" />
        <circle cx="14" cy="14" r="6" />
        <path d="M11 14l2 2 4-4" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-4 py-4 sm:px-6 lg:px-8"
      aria-labelledby="hiw-heading"
    >
      <div className="agency-panel-wrap mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-32">
        {/* Section header */}
        <Reveal className="text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
            How Aperix Works
          </p>
          <h2
            id="hiw-heading"
            className="font-display text-3xl font-bold text-agency-ink sm:text-4xl"
          >
          A clear process, from first message to finished site.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-agency-muted sm:text-lg">
            Every project follows the same sequence: brief, direction, build, launch, and support. That keeps scope clear and makes the process easy to quote and review.
          </p>
        </Reveal>

        {/* Steps grid */}
        <StaggerGroup
          staggerChildren={0.1}
          className="relative mx-auto mt-16 grid max-w-7xl gap-12 lg:mt-20 lg:grid-cols-3 lg:gap-0"
        >
          {/* ── Desktop dashed connecting line (spans full width behind the cards) ── */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-14 left-[16.67%] right-[16.67%] hidden h-px border-t border-dashed border-agency-border lg:block"
          />

          {STEPS.map((step) => (
            <StaggerItem
              key={step.number}
              preset="fadeUp"
              className="relative flex flex-col items-center text-center lg:px-10"
            >
              {/* Large decorative step number */}
              <span
                aria-hidden="true"
                className="absolute -top-4 z-0 select-none font-display text-8xl font-bold leading-none text-agency-surface2 lg:-top-6 lg:text-9xl"
              >
                {step.number}
              </span>

              {/* Icon circle */}
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-agency-border-dark bg-agency-bg text-agency-ink">
                {step.icon}
              </div>

              {/* Heading */}
              <h3 className="relative z-10 mt-6 font-display text-xl font-semibold">
                {step.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 mt-3 max-w-xs text-sm leading-relaxed text-agency-muted">
                {step.description}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
