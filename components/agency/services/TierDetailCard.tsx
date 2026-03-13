"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

/* ── types ─────────────────────────────────────────────── */
export interface TierDetailData {
  name: string;
  badge: "cyan" | "amber" | "violet";
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

/* ── x icon ────────────────────────────────────────────── */
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── badge colour map ──────────────────────────────────── */
const badgeColorMap: Record<string, string> = {
  cyan: "text-agency-accent",
  amber: "text-amber-400",
  violet: "text-violet-400",
};

const borderColorMap: Record<string, string> = {
  cyan: "border-agency-accent/40",
  amber: "border-amber-400/60",
  violet: "border-violet-400/40",
};

/* ── component ─────────────────────────────────────────── */
export default function TierDetailCard({ tier }: { tier: TierDetailData }) {
  const checkColour = badgeColorMap[tier.badge] ?? "text-agency-accent";

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "relative flex flex-col rounded-2xl border bg-agency-surface p-8",
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
      <div className="mb-6">
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
      <div className="mb-6 h-px bg-agency-border" />

      {/* included features */}
      <div className="mb-6">
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

      {/* not included */}
      <div className="mb-6">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-agency-text">
          Not included
        </h4>
        <ul className="space-y-2.5">
          {tier.notIncluded.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <XIcon className="mt-0.5 shrink-0 text-red-400/70" />
              <span className="text-sm leading-relaxed text-agency-muted/70">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* divider */}
      <div className="mb-6 h-px bg-agency-border" />

      {/* timeline & ideal for */}
      <div className="mb-6 space-y-3">
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
      <p className="mb-6 text-xs text-agency-muted/60">{tier.retainer}</p>

      {/* spacer + CTA */}
      <div className="mt-auto">
        <Link
          href={tier.demoLink}
          className={cn(
            "inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-colors",
            tier.popular
              ? "bg-amber-400 text-zinc-900 hover:bg-amber-300"
              : "border border-agency-border bg-agency-surface text-agency-text hover:border-agency-accent hover:text-agency-accent"
          )}
        >
          View the demo site →
        </Link>
      </div>
    </motion.div>
  );
}
