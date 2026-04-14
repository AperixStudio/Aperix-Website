"use client";

import { HoverLift, Reveal, StaggerGroup, StaggerItem } from "@/components/animations";
import { cn } from "@/lib/utils";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   TechnicalEdge (Benefits grid)
   Six-tile benefits section inspired by Lineads "Membership
   Benefits". Light bg, flat bordered cards, simple stagger.
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

interface Benefit {
  title: string;
  body: string;
  icon: React.ReactNode;
  tone: "blue" | "amber" | "violet";
}

const TONE_STYLES = {
  blue: {
    card: "border-t-4 border-agency-accent",
    icon: "border-agency-accent/25 bg-agency-accent/10 text-agency-accent",
  },
  amber: {
    card: "border-t-4 border-agency-accent2",
    icon: "border-agency-accent2/25 bg-agency-accent2/10 text-agency-accent2",
  },
  violet: {
    card: "border-t-4 border-agency-accent3",
    icon: "border-agency-accent3/25 bg-agency-accent3/10 text-agency-accent3",
  },
} as const;

const BENEFITS: Benefit[] = [
  {
    title: "Fixed Monthly Rate",
    body: "One clear monthly rate covers design, development, hosting, and support. No messy invoices or vague add-ons.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 8h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    tone: "blue",
  },
  {
    title: "Fast Turnaround",
    body: "We move quickly once content and approvals are in place, so projects don’t drag on for months.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 6v5l3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    tone: "amber",
  },
  {
    title: "You Own Everything",
    body: "The code, domain, and accounts are yours. If you ever want to move on, you’re not stuck with us.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="4" y="10" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    tone: "violet",
  },
  {
    title: "Search-Ready",
    body: "We build with search in mind from the start, including the basics that help your site launch in good shape.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15.5 15.5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 7v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    tone: "blue",
  },
  {
    title: "Hosted & Maintained",
    body: "We handle hosting, updates, and the routine technical maintenance so you can stay focused on the business.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M4 5h14a1 1 0 0 1 1 1v4H3V6a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 10h16v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7" cy="7.5" r="1" fill="currentColor" />
        <circle cx="7" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
    tone: "amber",
  },
  {
    title: "Melbourne Based",
    body: "We’re based in Melbourne, easy to reach, and hands-on throughout the project. No offshore handoffs and no being bounced around.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 2C7.69 2 5 4.9 5 8.5 5 13.5 11 20 11 20s6-6.5 6-11.5C17 4.9 14.31 2 11 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="11" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    tone: "violet",
  },
];

export default function TechnicalEdge() {
  return (
    <section
      className="px-4 py-4 sm:px-6 lg:px-8"
      aria-labelledby="benefits-heading"
    >
      <div className="agency-panel-wrap mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-32">
        {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Reveal className="mb-12 max-w-xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
            Why Aperix
          </p>
          <h2
            id="benefits-heading"
            className="font-display text-3xl font-bold leading-tight text-agency-ink sm:text-4xl lg:text-5xl"
          >
            What working with us actually looks like.
          </h2>
        </Reveal>

        {/* â”€â”€ Grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <StaggerGroup className="grid gap-px border border-agency-border bg-agency-border sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.06}>
          {BENEFITS.map((b) => (
            <StaggerItem key={b.title} className="bg-agency-bg">
              <HoverLift className={cn("flex h-full flex-col gap-4 p-8", TONE_STYLES[b.tone].card)}>
              <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border", TONE_STYLES[b.tone].icon)}>{b.icon}</span>
              <h3 className="font-display text-lg font-semibold text-agency-ink">
                {b.title}
              </h3>
              <p className="text-sm leading-relaxed text-agency-muted">{b.body}</p>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
