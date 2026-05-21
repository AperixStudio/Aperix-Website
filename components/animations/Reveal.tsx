"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps, type Variants, type ViewportOptions } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { createFadeUp, defaultViewport } from "@/components/animations/motionPresets";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: Variants;
  viewport?: ViewportOptions;
}

export function Reveal({
  children,
  variant,
  viewport,
  initial,
  whileInView,
  ...props
}: RevealProps) {
  const prefersReduced = useReducedMotion();
  const resolvedVariant = variant ?? createFadeUp();

  return (
    <motion.div
      variants={prefersReduced ? undefined : resolvedVariant}
      initial={prefersReduced ? false : (initial ?? "hidden")}
      whileInView={prefersReduced ? undefined : (whileInView ?? "visible")}
      viewport={viewport ?? defaultViewport}
      style={{ willChange: "transform, opacity", backfaceVisibility: "hidden", ...props.style }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
