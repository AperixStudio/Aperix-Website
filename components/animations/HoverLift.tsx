"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { createSpringTransition } from "@/components/animations/motionPresets";

interface HoverLiftProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  lift?: number;
  scale?: number;
}

export function HoverLift({
  children,
  lift = 6,
  scale = 1.01,
  whileHover,
  whileTap,
  transition,
  ...props
}: HoverLiftProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      whileHover={prefersReduced ? undefined : (whileHover ?? { y: -lift, scale })}
      whileTap={prefersReduced ? undefined : (whileTap ?? { scale: 0.99 })}
      transition={transition ?? createSpringTransition()}
      {...props}
    >
      {children}
    </motion.div>
  );
}
