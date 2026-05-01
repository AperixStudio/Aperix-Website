"use client";

import type { Transition, Variants, ViewportOptions } from "framer-motion";

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const defaultViewport: ViewportOptions = {
  once: true,
  amount: 0.15,
};

export function createFadeUp(distance = 20, duration = 0.45): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: motionEase },
    },
  };
}

export function createScaleIn(scale = 0.96, duration = 0.4): Variants {
  return {
    hidden: { opacity: 0, scale },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration, ease: motionEase },
    },
  };
}

export function createSlideIn(
  axis: "x" | "y" = "x",
  distance = 24,
  duration = 0.45,
): Variants {
  return {
    hidden: axis === "x" ? { opacity: 0, x: distance } : { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: motionEase },
    },
  };
}

export function createStaggerContainer(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

export function createSpringTransition(overrides?: Partial<Transition>): Transition {
  return {
    type: "spring",
    stiffness: 320,
    damping: 28,
    mass: 0.45,
    ...overrides,
  };
}
