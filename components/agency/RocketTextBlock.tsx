"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { RocketTextAnchor, RocketTextBlock as RocketTextBlockConfig } from "@/lib/howItWorksContent";

/** Fixed width — all cards match regardless of placement anchor */
const CARD_WIDTH_CLASS = "w-[min(22rem,calc(100vw-3rem))]";

const CARD_SURFACE_CLASS =
  "rounded-xl border border-agency-border/80 bg-agency-surface/85 p-5 shadow-[0_16px_48px_rgba(15,17,20,0.2)] backdrop-blur-md lg:p-6";

const ANCHOR_TRANSLATE: Record<RocketTextAnchor, string> = {
  "top-left": "translate(0, 0)",
  "top-right": "translate(-100%, 0)",
  "bottom-left": "translate(0, -100%)",
  "bottom-right": "translate(-100%, -100%)",
  center: "translate(-50%, -50%)",
  "center-left": "translate(0, -50%)",
  "center-right": "translate(-100%, -50%)",
};

function getPlacementStyle(anchor: RocketTextAnchor, x: number, y: number) {
  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: ANCHOR_TRANSLATE[anchor],
  } as const;
}

type RocketTextBlockProps = {
  block: RocketTextBlockConfig;
  scrollYProgress: MotionValue<number>;
  prefersReduced: boolean;
};

function fadeSegment(progress: number, start: number, end: number) {
  if (end <= start) {
    return progress >= start ? 1 : 0;
  }
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

export default function RocketTextBlock({
  block,
  scrollYProgress,
  prefersReduced,
}: RocketTextBlockProps) {
  const { in: fadeIn, holdStart, holdEnd, out: fadeOut } = block.progress;
  const anchor = block.placement.anchor ?? "top-left";

  const opacity = useTransform(scrollYProgress, (progress) => {
    if (progress < fadeIn || progress > fadeOut) {
      return 0;
    }
    if (progress < holdStart) {
      return fadeSegment(progress, fadeIn, Math.max(holdStart, fadeIn + 0.001));
    }
    if (progress <= holdEnd) {
      return 1;
    }
    return 1 - fadeSegment(progress, holdEnd, Math.max(fadeOut, holdEnd + 0.001));
  });

  const y = useTransform(scrollYProgress, (progress) => {
    if (progress < fadeIn || progress > fadeOut) {
      return 0;
    }
    if (progress < holdStart) {
      return 20 * (1 - fadeSegment(progress, fadeIn, Math.max(holdStart, fadeIn + 0.001)));
    }
    return 0;
  });

  const placementStyle = getPlacementStyle(anchor, block.placement.x, block.placement.y);

  if (prefersReduced) {
    return (
      <article className={`relative ${CARD_WIDTH_CLASS}`} aria-label={`${block.number}. ${block.title}`}>
        <div className={CARD_SURFACE_CLASS}>
          <p className="font-display text-4xl font-bold leading-none text-agency-ink lg:text-5xl">
            {block.number}
          </p>
          <h3 className="mt-4 font-display text-xl font-semibold text-agency-ink lg:text-2xl">
            {block.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-agency-muted lg:text-base">{block.body}</p>
        </div>
      </article>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute ${CARD_WIDTH_CLASS}`}
      style={placementStyle}
      aria-label={`${block.number}. ${block.title}`}
    >
      <motion.div style={{ opacity, y }}>
        <div className={CARD_SURFACE_CLASS}>
          <p className="font-display text-4xl font-bold leading-none text-agency-ink lg:text-5xl">
            {block.number}
          </p>
          <h3 className="mt-4 font-display text-xl font-semibold text-agency-ink lg:text-2xl">
            {block.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-agency-muted lg:text-base">{block.body}</p>
        </div>
      </motion.div>
    </div>
  );
}
