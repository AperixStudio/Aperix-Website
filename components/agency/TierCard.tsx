import Link from "next/link";
import { cn } from "@/lib/utils";
import { type BadgeProps } from "@/components/ui/Badge";

/* ────────────────────────────────────────────────────────────
   TierCard — PRD §4.2.5
   Single tier pricing card. Rendered inside TierShowcase.
   ──────────────────────────────────────────────────────────── */

interface TierCardProps {
  /** Tier display name */
  name: string;
  /** Badge colour key */
  color: NonNullable<BadgeProps["color"]>;
  /** Price range string, e.g. "$1,500 – $3,000" */
  price: string;
  /** One-line value proposition */
  valueProp: string;
  /** Included features (checkmark list) */
  features: string[];
  /** Recurring cost line */
  retainer: string;
  /** Route the CTA links to */
  demoHref: string;
  /** Show the "Most Popular" highlighted treatment */
  popular?: boolean;
  /** Optional className for layout sizing from parent */
  className?: string;
}

export default function TierCard({
  name,
  color,
  price,
  valueProp,
  features,
  retainer,
  demoHref,
  popular = false,
  className,
}: TierCardProps) {
  return (
    <div
      data-tier-color={color}
      className={cn(
        "relative flex flex-col rounded-2xl border bg-agency-surface p-8 text-agency-text shadow-[0_18px_50px_rgba(67,92,122,0.08)]",
        "transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(67,92,122,0.14)]",
        "border-agency-border",
        className,
      )}
    >
      {/* ── "Most Popular" pill ──────────────────────────────── */}
      {popular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-agency-border bg-agency-surface2 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-agency-muted">
            Most Popular
        </span>
      )}

      {/* ── Tier badge ──────────────────────────────────────── */}
      <p className="mb-5 text-xs font-semibold tracking-[0.16em] uppercase text-agency-muted">
        {name}
      </p>

      {/* ── Price ───────────────────────────────────────────── */}
      <p className="mt-5 font-display text-3xl font-bold tracking-tight text-agency-ink">
        {price}
      </p>
      <p className="mt-1 text-xs text-agency-muted">AUD, excl. GST</p>

      {/* ── Value prop ──────────────────────────────────────── */}
      <p className="mt-4 text-sm leading-relaxed text-agency-muted">
        {valueProp}
      </p>

      {/* ── Divider ─────────────────────────────────────────── */}
      <hr className="my-6 border-agency-border" />

      {/* ── Feature list ────────────────────────────────────── */}
      <ul className="flex flex-1 flex-col gap-3" role="list">
        {features.map((feat) => (
          <li key={feat} className="text-sm text-agency-text">
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      {/* ── Retainer line ───────────────────────────────────── */}
      <p className="mt-6 text-xs text-agency-muted">{retainer}</p>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <Link
        href={demoHref}
        className={cn(
          "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-agency-border bg-agency-surface2 px-6 py-3 text-sm font-medium text-agency-text",
          "transition-all duration-150 active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-agency-surface",
          "hover:border-agency-border-dark hover:bg-agency-surface",
        )}
      >
        View Live Demo
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}

export type { TierCardProps };
