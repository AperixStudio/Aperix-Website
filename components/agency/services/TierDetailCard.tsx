"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

/* ── types ─────────────────────────────────────────────── */
export interface TierDetailData {
  name: string;
  badge: "muted" | "cyan" | "amber" | "violet";
  price: string;
  valueProp: string;
  features: string[];
  notIncluded: string[];
  timeline: string;
  idealFor: string;
  retainer: string;
  demoLink: string;
  popular?: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ── check icon ────────────────────────────────────────── */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ── badge colour map ──────────────────────────────────── */
const badgeColorMap: Record<string, string> = {
  muted: "text-agency-muted",
  cyan: "text-agency-accent",
  amber: "text-amber-400",
  violet: "text-violet-400",
};

const borderColorMap: Record<string, string> = {
  muted: "border-agency-border-dark/60",
  cyan: "border-agency-accent/40",
  amber: "border-amber-400/60",
  violet: "border-violet-400/40",
};

const cardToneMap: Record<TierDetailData["badge"], string> = {
  muted: "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--agency-muted)_13%,var(--agency-surface)_87%),var(--agency-surface))]",
  cyan: "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--agency-accent)_10%,var(--agency-surface)_90%),var(--agency-surface))]",
  amber: "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--agency-accent2)_14%,var(--agency-surface)_86%),var(--agency-surface))]",
  violet: "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--agency-accent3)_14%,var(--agency-surface)_86%),var(--agency-surface))]",
};

/* ── component ─────────────────────────────────────────── */
export default function TierDetailCard({ tier }: { tier: TierDetailData }) {
  const checkColour = badgeColorMap[tier.badge] ?? "text-agency-accent";

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "relative flex h-full min-h-120 flex-col rounded-2xl border p-5 sm:p-6",
        cardToneMap[tier.badge],
        tier.popular
          ? `${borderColorMap[tier.badge]} ring-1 ring-amber-400/30`
          : "border-agency-border"
      )}
    >
      {/* popular pill */}
      {tier.popular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-zinc-900">
          Most Popular
        </span>
      )}

      {/* header */}
      <div className="mb-5">
        <Badge color={tier.badge} variant="subtle" size="sm">
          {tier.name}
        </Badge>

        <p className="mt-4 flex items-baseline gap-1">
          <span className="font-display text-4xl font-bold tracking-tight text-agency-text">
            {tier.price}
          </span>
          <span className="text-sm text-agency-muted">one-off</span>
        </p>

        <p className="mt-2 text-sm leading-relaxed text-agency-muted">
          {tier.valueProp}
        </p>
      </div>

      {/* divider */}
      <div className="mb-5 h-px bg-agency-border" />

      {/* included features */}
      <div className="mb-5">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-agency-text">
          What&apos;s included
        </h4>
        <ul className="space-y-2.5">
          {tier.features.map((feat) => (
            <li key={feat} className="flex items-start gap-2.5">
              <CheckIcon className={cn("mt-0.5 shrink-0", checkColour)} />
              <span className="text-sm leading-relaxed text-agency-muted">
                {feat}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-5 h-px bg-agency-border" />

      {/* timeline & ideal for */}
      <div className="mb-5 space-y-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-agency-text">
            Typical timeline
          </span>
          <p className="mt-1 text-sm text-agency-muted">{tier.timeline}</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-agency-text">
            Ideal for
          </span>
          <p className="mt-1 text-sm text-agency-muted">{tier.idealFor}</p>
        </div>
      </div>

      {/* retainer */}
      <p className="mb-5 text-xs text-agency-muted/60">{tier.retainer}</p>

      {/* spacer + CTA */}
      <div className="mt-auto">
        <div className="grid gap-2">
          <Link
            href={`/contact?tier=${encodeURIComponent(tier.name)}`}
            className={cn(
              "inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-colors",
              tier.popular
                ? "bg-amber-400 text-zinc-900 hover:bg-amber-300"
                : "bg-agency-ink text-agency-bg hover:opacity-85"
            )}
          >
            Ask about {tier.name} →
          </Link>
          <Link
            href={tier.demoLink}
            className="inline-flex w-full items-center justify-center rounded-xl border border-agency-border bg-agency-surface/70 px-6 py-2.5 text-sm font-semibold text-agency-text transition-colors hover:border-agency-accent hover:text-agency-accent"
          >
            View the demo
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
