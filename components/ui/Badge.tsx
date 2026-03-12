import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   Badge Component
   PRD §4.2.5 — Tier badges (Starter / Business / Premium)
   and trust‑row stat badges in the hero (§4.2.2).
   ──────────────────────────────────────────────────────────── */

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Colour key that maps to a CSS custom property */
  color?: "cyan" | "amber" | "violet" | "muted";
  /** Visual treatment */
  variant?: "solid" | "outline" | "subtle";
  /** Size preset */
  size?: "sm" | "md" | "lg";
}

const colorMap: Record<
  NonNullable<BadgeProps["color"]>,
  { solid: string; outline: string; subtle: string }
> = {
  cyan: {
    solid:
      "bg-[var(--agency-accent)] text-[var(--agency-bg)]",
    outline:
      "border border-[var(--agency-accent)] text-[var(--agency-accent)]",
    subtle:
      "bg-[color-mix(in_oklab,var(--agency-accent)_15%,transparent)] text-[var(--agency-accent)]",
  },
  amber: {
    solid:
      "bg-[var(--agency-accent2)] text-[var(--agency-bg)]",
    outline:
      "border border-[var(--agency-accent2)] text-[var(--agency-accent2)]",
    subtle:
      "bg-[color-mix(in_oklab,var(--agency-accent2)_15%,transparent)] text-[var(--agency-accent2)]",
  },
  violet: {
    solid:
      "bg-[var(--agency-accent3)] text-[var(--agency-bg)]",
    outline:
      "border border-[var(--agency-accent3)] text-[var(--agency-accent3)]",
    subtle:
      "bg-[color-mix(in_oklab,var(--agency-accent3)_15%,transparent)] text-[var(--agency-accent3)]",
  },
  muted: {
    solid:
      "bg-[var(--agency-surface2)] text-[var(--agency-muted)]",
    outline:
      "border border-[var(--agency-border)] text-[var(--agency-muted)]",
    subtle:
      "bg-[var(--agency-surface)] text-[var(--agency-muted)]",
  },
};

const sizeStyles: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

function Badge({
  className,
  color = "cyan",
  variant = "subtle",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium leading-none whitespace-nowrap",
        colorMap[color][variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps };
