"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps, type Variants, type ViewportOptions } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  createFadeUp,
  createScaleIn,
  createSlideIn,
  createStaggerContainer,
  defaultViewport,
} from "@/components/animations/motionPresets";

type PresetName = "fadeUp" | "scaleIn" | "slideUp" | "slideLeft";

interface StaggerGroupProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  viewport?: ViewportOptions;
}

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "children" | "variants"> {
  children: ReactNode;
  preset?: PresetName;
  variants?: Variants;
}

function getPreset(name: PresetName): Variants {
  switch (name) {
    case "scaleIn":
      return createScaleIn();
    case "slideUp":
      return createSlideIn("y", 28);
    case "slideLeft":
      return createSlideIn("x", 28);
    case "fadeUp":
    default:
      return createFadeUp();
  }
}

export function StaggerGroup({
  children,
  staggerChildren = 0.08,
  delayChildren = 0,
  viewport,
  initial,
  whileInView,
  ...props
}: StaggerGroupProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      variants={prefersReduced ? undefined : createStaggerContainer(staggerChildren, delayChildren)}
      initial={prefersReduced ? false : (initial ?? "hidden")}
      whileInView={prefersReduced ? undefined : (whileInView ?? "visible")}
      viewport={viewport ?? defaultViewport}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  preset = "fadeUp",
  variants,
  ...props
}: StaggerItemProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div variants={prefersReduced ? undefined : (variants ?? getPreset(preset))} {...props}>
      {children}
    </motion.div>
  );
}
