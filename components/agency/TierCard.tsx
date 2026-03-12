import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/Badge";

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
}

/* ── Checkmark icon ─────────────────────────────────────────── */
function Check({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Border-colour map (resolves to CSS vars the card uses) ── */
const borderColorMap: Record<NonNullable<BadgeProps["color"]>, string> = {
  cyan: "border-agency-accent",
  amber: "border-agency-accent2",
  violet: "border-agency-accent3",
  muted: "border-agency-border",
};

const checkColorMap: Record<NonNullable<BadgeProps["color"]>, string> = {
  cyan: "text-agency-accent",
  amber: "text-agency-accent2",
  violet: "text-agency-accent3",
  muted: "text-agency-muted",
};

/* CTA variant per colour so the button matches the tier */
const ctaBgMap: Record<NonNullable<BadgeProps["color"]>, string> = {
  cyan: "bg-agency-accent hover:bg-agency-accent/85",
  amber: "bg-agency-accent2 hover:bg-agency-accent2/85",
  violet: "bg-agency-accent3 hover:bg-agency-accent3/85",
  muted: "bg-agency-muted hover:bg-agency-muted/85",
};

export default function TierCard({
  name,
  color,
  price,
  valueProp,
  features,
  retainer,
  demoHref,
  popular = false,
}: TierCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-agency-surface p-8",
        "transition-transform duration-150 ease-out hover:scale-[1.02]",
        popular
          ? cn(borderColorMap[color], "border-2 shadow-lg shadow-agency-accent2/10")
          : "border-agency-border",
      )}
    >
      {/* ── "Most Popular" pill ──────────────────────────────── */}
      {popular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge color={color} variant="solid" size="sm">
            Most Popular
          </Badge>
        </span>
      )}

      {/* ── Tier badge ──────────────────────────────────────── */}
      <Badge color={color} variant="subtle" size="md">
        {name}
      </Badge>

      {/* ── Price ───────────────────────────────────────────── */}
      <p className="mt-5 font-display text-3xl font-bold tracking-tight">
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
          <li key={feat} className="flex items-start gap-2.5 text-sm text-agency-text">
            <Check className={checkColorMap[color]} />
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
          "mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium",
          "text-agency-bg transition-all duration-150 active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-agency-surface",
          ctaBgMap[color],
        )}
      >
        View Live Demo
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}

export type { TierCardProps };
