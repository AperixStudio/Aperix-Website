import Link from "next/link";
import { cn } from "@/lib/utils";
import { type BadgeProps } from "@/components/ui/Badge";

interface TierCardProps {
  name: string;
  color: NonNullable<BadgeProps["color"]>;
  price: string;
  valueProp: string;
  features: string[];
  retainer: string;
  contactHref?: string;
  popular?: boolean;
  className?: string;
}

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
  contactHref = "/contact",
  popular = false,
  className,
}: TierCardProps) {
  return (
    <div
      data-tier-color={color}
      className={cn(
        "relative flex h-full min-h-108 w-full flex-col rounded-2xl border p-5 text-agency-text shadow-[0_18px_50px_rgba(67,92,122,0.08)] sm:p-6",
        "transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(67,92,122,0.14)]",
        cardToneMap[color],
        popular ? cn(borderColorMap[color], "border-2") : "border-agency-border",
        className,
      )}
    >
      {popular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-agency-border bg-agency-surface2 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-agency-muted">
          Most Popular
        </span>
      )}

      <p className="mb-5 text-xs font-semibold tracking-[0.16em] uppercase text-agency-muted">
        {name}
      </p>

      <p className="mt-4 font-display text-3xl font-bold tracking-tight text-agency-ink">
        {price}
      </p>
      <p className="mt-1 text-xs text-agency-muted">AUD, excl. GST</p>

      <p className="mt-3 text-sm leading-relaxed text-agency-muted">
        {valueProp}
      </p>

      <hr className="my-5 border-agency-border" />

      <ul className="flex flex-1 flex-col gap-2.5" role="list">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-agency-text">
            <Check className={checkColorMap[color]} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-lg border border-agency-border bg-agency-surface/60 px-4 py-3">
        <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-agency-muted">Ongoing care</p>
        <p className="text-sm font-medium text-agency-text">{retainer}</p>
        <p className="mt-0.5 text-xs text-agency-muted">Hosting, updates & support</p>
      </div>

      <div className="mt-4 grid gap-2">
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

      </div>
    </div>
  );
}

export type { TierCardProps };
