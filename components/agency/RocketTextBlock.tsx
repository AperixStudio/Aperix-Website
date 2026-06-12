"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { RocketTextAnchor, RocketTextBlock as RocketTextBlockConfig } from "@/lib/howItWorksContent";

/** Fixed width — all cards match regardless of placement anchor */
const CARD_WIDTH_CLASS = "w-[min(22rem,calc(100vw-3rem))]";

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

export default function RocketTextBlock({
  block,
  scrollYProgress,
  prefersReduced,
}: RocketTextBlockProps) {
  const { in: fadeIn, holdStart, holdEnd, out: fadeOut } = block.progress;
  const anchor = block.placement.anchor ?? "top-left";

  const opacity = useTransform(scrollYProgress, (progress) => {
    if (progress < fadeIn || progress > fadeOut) return 0;
    if (progress < holdStart) return (progress - fadeIn) / (holdStart - fadeIn);
    if (progress <= holdEnd) return 1;
    return (fadeOut - progress) / (fadeOut - holdEnd);
  });

  const y = useTransform(scrollYProgress, (progress) => {
    if (progress < fadeIn || progress > fadeOut) return 0;
    if (progress < holdStart) {
      const t = (progress - fadeIn) / (holdStart - fadeIn);
      return 20 * (1 - t);
    }
    return 0;
  });

  const visibility = useTransform(opacity, (value) => (value > 0.02 ? "visible" : "hidden"));
  const placementStyle = getPlacementStyle(anchor, block.placement.x, block.placement.y);

  return (
    <motion.article
      style={
        prefersReduced
          ? undefined
          : {
              opacity,
              visibility,
              ...placementStyle,
            }
      }
      className={
        prefersReduced ? `relative ${CARD_WIDTH_CLASS}` : `absolute ${CARD_WIDTH_CLASS}`
      }
      aria-label={`${block.number}. ${block.title}`}
    >
      <motion.div style={prefersReduced ? undefined : { y }}>
        <div className="rounded-xl border border-agency-border/60 bg-agency-bg/85 p-5 shadow-[0_12px_40px_rgba(15,17,20,0.08)] backdrop-blur-sm lg:p-6">
          <p className="font-display text-4xl font-bold leading-none text-agency-surface2 lg:text-5xl">
            {block.number}
          </p>
          <h3 className="mt-4 font-display text-xl font-semibold text-agency-ink lg:text-2xl">
            {block.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-agency-muted lg:text-base">{block.body}</p>
        </div>
      </motion.div>
    </motion.article>
  );
}
