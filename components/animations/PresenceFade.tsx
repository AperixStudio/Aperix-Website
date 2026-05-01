"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface PresenceFadeProps {
  show: boolean;
  children: ReactNode;
  className?: string;
  presenceKey?: string;
}

export function PresenceFade({
  show,
  children,
  className,
  presenceKey = "presence-fade",
}: PresenceFadeProps) {
  const prefersReduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {show ? (
        <motion.div
          key={presenceKey}
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
          transition={prefersReduced ? undefined : { duration: 0.2, ease: "easeOut" }}
          className={className}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
