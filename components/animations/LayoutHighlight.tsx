"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface LayoutHighlightProps {
  layoutId?: string;
  className?: string;
}

export function LayoutHighlight({
  layoutId = "shared-layout-highlight",
  className,
}: LayoutHighlightProps) {
  return (
    <motion.span
      layoutId={layoutId}
      className={cn("absolute inset-0 rounded-full", className)}
    />
  );
}
