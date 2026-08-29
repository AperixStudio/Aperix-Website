"use client";

import Image from "next/image";
import type { CSSProperties, MouseEvent } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Native aperix-logo.svg dimensions (768 × 836) — height derives from this.
const LOGO_ASPECT = 836 / 768;

type AnimatedLogoProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  onMouseEnter?: (event: MouseEvent<HTMLImageElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLImageElement>) => void;
};

/**
 * The Aperix hexagon mark, continuously rotating — same asset and animation
 * as the header logo on /current (AgencyNavV2). Shared here so every place
 * the mark appears (fixed top logo, footer) is the same logo, not a lookalike.
 */
export default function AnimatedLogo({
  size = 34,
  className,
  style,
  priority = false,
  onMouseEnter,
  onMouseLeave,
}: AnimatedLogoProps) {
  const prefersReduced = useReducedMotion();
  const height = Math.round(size * LOGO_ASPECT);

  return (
    <motion.span
      className="relative inline-block shrink-0 overflow-hidden rounded-sm"
      animate={prefersReduced ? undefined : { rotate: 360 }}
      transition={prefersReduced ? undefined : { duration: 5, ease: "linear", repeat: Infinity }}
    >
      <Image
        src="/aperix-logo.svg"
        alt=""
        width={size}
        height={height}
        priority={priority}
        aria-hidden="true"
        className={className}
        style={{ display: "block", ...style }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </motion.span>
  );
}
