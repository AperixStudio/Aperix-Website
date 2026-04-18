"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface ShimmerProps {
  className?: string;
  style?: CSSProperties;
  duration?: number;
}

export function Shimmer({ className, style, duration = 1.3 }: ShimmerProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full border border-agency-border/50 bg-agency-surface2/60",
        className,
      )}
    >
      {prefersReduced ? null : (
        <motion.div
          className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/85 to-transparent"
          animate={{ x: ["-20%", "360%"] }}
          transition={{ duration, ease: "linear", repeat: Infinity }}
        />
      )}
    </div>
  );
}
