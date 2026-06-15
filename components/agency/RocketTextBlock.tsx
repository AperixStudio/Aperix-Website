"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { RocketTextAnchor, RocketTextBlock as RocketTextBlockConfig, RocketTextPlacement } from "@/lib/howItWorksContent";
import { useMobileViewport } from "@/lib/useMobileViewport";

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

function resolvePlacement(placement: RocketTextPlacement, isMobile: boolean) {
  if (isMobile && placement.mobile) {
    return {
      x: placement.mobile.x,
      y: placement.mobile.y,
      anchor: placement.mobile.anchor ?? placement.anchor,
    };
  }

  return placement;
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
  const { isMobile } = useMobileViewport();
  const { in: fadeIn, holdStart, holdEnd, out: fadeOut } = block.progress;
  const { x: placementX, y: placementY, anchor = "top-left" } = resolvePlacement(block.placement, isMobile);

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

  const motionY = useTransform(scrollYProgress, (progress) => {
    if (progress < fadeIn || progress > fadeOut) {
      return 0;
    }
    if (progress < holdStart) {
      return 20 * (1 - fadeSegment(progress, fadeIn, Math.max(holdStart, fadeIn + 0.001)));
    }
    return 0;
  });

  const placementStyle = getPlacementStyle(anchor, placementX, placementY);

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
      <motion.div style={{ opacity, y: motionY }}>
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
