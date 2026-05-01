"use client";

import { motion, type SVGMotionProps } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface DrawPathProps extends SVGMotionProps<SVGPathElement> {
  delay?: number;
}

export function DrawPath({ delay = 0, ...props }: DrawPathProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.path
      initial={prefersReduced ? false : { pathLength: 0, opacity: 0 }}
      whileInView={prefersReduced ? undefined : { pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={prefersReduced ? undefined : { duration: 0.7, ease: "easeOut", delay }}
      {...props}
    />
  );
}
