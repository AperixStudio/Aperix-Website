"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, type HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface ParallaxLayerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  offset?: number;
}

export function ParallaxLayer({ children, offset = 24, style, ...props }: ParallaxLayerProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const y = useSpring(rawY, { stiffness: 180, damping: 24, mass: 0.35 });

  return (
    <motion.div
      ref={ref}
      style={{ ...style, y: prefersReduced ? 0 : y }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
