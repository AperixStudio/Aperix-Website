import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   Button Component
   PRD §3.5 — explicit `type`, keyboard-navigable, WCAG AA
   Variants map to the agency accent palette.
   ──────────────────────────────────────────────────────────── */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: "primary" | "secondary" | "outline" | "ghost";
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Render as full-width block */
  fullWidth?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--agency-accent)] text-[var(--agency-bg)] hover:bg-[color-mix(in_oklab,var(--agency-accent)_85%,black)] focus-visible:ring-[var(--agency-accent)]",
  secondary:
    "bg-[var(--agency-accent2)] text-[var(--agency-bg)] hover:bg-[color-mix(in_oklab,var(--agency-accent2)_85%,black)] focus-visible:ring-[var(--agency-accent2)]",
  outline:
    "border border-[var(--agency-border)] text-[var(--agency-text)] bg-transparent hover:bg-[var(--agency-surface)] focus-visible:ring-[var(--agency-accent)]",
  ghost:
    "text-[var(--agency-muted)] bg-transparent hover:text-[var(--agency-text)] hover:bg-[var(--agency-surface)] focus-visible:ring-[var(--agency-accent)]",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      type = "button",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        data-cursor-pill
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-medium rounded-lg",
          "transition-all duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-(--agency-bg)",
          "disabled:pointer-events-none disabled:opacity-50",
          "active:scale-[0.98]",
          // Variant & size
          variantStyles[variant],
          sizeStyles[size],
          // Full-width option
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps };
