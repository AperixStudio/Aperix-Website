"use client";

import type { CSSProperties, MouseEvent } from "react";
import ArrowheadLogo3D from "@/components/agency/arrowhead/ArrowheadLogo3D";

// arrowhead-mark.svg viewBox is 921.75 × 668.50 — height derives from this.
const LOGO_ASPECT = 668.5 / 921.75;

type AnimatedLogoProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  onMouseEnter?: (event: MouseEvent<HTMLSpanElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLSpanElement>) => void;
};

/**
 * The Aperix arrowhead mark, animating through its three-act WebGL sequence
 * (reveal → track → orbit) — same module and tuning as the hero deliverable.
 * Shared here so every place the mark appears (nav, fixed top logo, footer,
 * intro) is the same logo, not a lookalike.
 */
export default function AnimatedLogo({
  size = 34,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
}: AnimatedLogoProps) {
  const height = Math.round(size * LOGO_ASPECT);

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height,
        overflow: "hidden",
        ...style,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* tilt: 0 — no pointer tracking; once loaded it just spins in the orbit act. */}
      <ArrowheadLogo3D options={{ tilt: 0 }} />
    </span>
  );
}
