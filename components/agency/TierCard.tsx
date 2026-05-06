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
  /** Route to start a conversation about this tier */
  contactHref?: string;
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
  cyan: "border-agency-accent/45",
  amber: "border-agency-accent2/45",
  violet: "border-agency-accent3/45",
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
  cyan: "border-agency-accent/50 bg-agency-accent text-white hover:bg-agency-accent/90",
  amber: "border-agency-accent2/50 bg-agency-accent2 text-agency-ink hover:bg-agency-accent2/90",
  violet: "border-agency-accent3/50 bg-agency-accent3 text-white hover:bg-agency-accent3/90",
  muted: "border-agency-border-dark bg-agency-ink text-agency-bg hover:opacity-85",
};

const cardToneMap: Record<NonNullable<BadgeProps["color"]>, string> = {
  cyan: "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--agency-accent)_10%,var(--agency-surface)_90%),var(--agency-surface))]",
  amber: "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--agency-accent2)_14%,var(--agency-surface)_86%),var(--agency-surface))]",
  violet: "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--agency-accent3)_14%,var(--agency-surface)_86%),var(--agency-surface))]",
  muted: "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--agency-muted)_13%,var(--agency-surface)_87%),var(--agency-surface))]",
};

export default function TierCard({
  name,
  color,
  price,
  valueProp,
  features,
  retainer,
  demoHref,
  contactHref = "/contact",
  popular = false,
}: TierCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-full min-h-108 w-full flex-col rounded-2xl border p-5 text-agency-text shadow-[0_18px_50px_rgba(67,92,122,0.08)] sm:p-6",
        "transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(67,92,122,0.14)]",
        cardToneMap[color],
        popular
          ? cn(borderColorMap[color], "border-2")
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
      <p className="mt-4 font-display text-3xl font-bold tracking-tight text-agency-ink">
        {price}
      </p>
      <p className="mt-1 text-xs text-agency-muted">AUD, excl. GST</p>

      {/* ── Value prop ──────────────────────────────────────── */}
      <p className="mt-3 text-sm leading-relaxed text-agency-muted">
        {valueProp}
      </p>

      {/* ── Divider ─────────────────────────────────────────── */}
      <hr className="my-5 border-agency-border" />

      {/* ── Feature list ────────────────────────────────────── */}
      <ul className="flex flex-1 flex-col gap-2.5" role="list">
        {features.map((feat) => (
          <li key={feat} className="flex items-start gap-2.5 text-sm text-agency-text">
            <Check className={checkColorMap[color]} />
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      {/* ── Retainer line ───────────────────────────────────── */}
      <p className="mt-5 text-xs text-agency-muted">{retainer}</p>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <div className="mt-5 grid gap-2">
        <Link
          href={`${contactHref}?tier=${encodeURIComponent(name)}`}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium",
            "transition-all duration-150 active:scale-[0.98]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-agency-surface",
            ctaBgMap[color],
          )}
        >
          Ask about {name}
          <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          href={demoHref}
          className="inline-flex items-center justify-center rounded-lg border border-agency-border bg-agency-surface/70 px-5 py-2.5 text-sm font-medium text-agency-ink transition-colors hover:border-agency-accent hover:text-agency-accent"
        >
          View demo
        </Link>
      </div>
    </div>
  );
}

export type { TierCardProps };
