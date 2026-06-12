"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import RocketTextBlock from "@/components/agency/RocketTextBlock";
import { HOW_IT_WORKS_BLOCKS } from "@/lib/howItWorksContent";
import { useReducedMotion } from "@/lib/useReducedMotion";
import "@/components/animations/DeskEvolutionCanvas.css";

const DeskEvolutionCanvas = dynamic(() => import("@/components/animations/DeskEvolutionCanvas"), {
  ssr: false,
});

const SCROLL_HEIGHT_VH = 300;

const ERA_LABELS = ["Blueprint", "Wireframe", "Live site"];

function EraLabel({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const era0Opacity = useTransform(scrollYProgress, [0, 0.3, 0.36], [1, 1, 0]);
  const era1Opacity = useTransform(scrollYProgress, [0.3, 0.36, 0.6, 0.66], [0, 1, 1, 0]);
  const era2Opacity = useTransform(scrollYProgress, [0.6, 0.66, 1], [0, 1, 1]);
  const containerOpacity = useTransform(scrollYProgress, [0, 0.04, 0.96, 1], [0, 1, 1, 0.85]);

  return (
    <motion.div style={{ opacity: containerOpacity }} className="desk-evolution-era" aria-hidden="true">
      <motion.span style={{ opacity: era0Opacity, position: "absolute", inset: 0 }}>{ERA_LABELS[0]}</motion.span>
      <motion.span style={{ opacity: era1Opacity, position: "absolute", inset: 0 }}>{ERA_LABELS[1]}</motion.span>
      <motion.span style={{ opacity: era2Opacity, position: "absolute", inset: 0 }}>{ERA_LABELS[2]}</motion.span>
    </motion.div>
  );
}

export default function HowItWorksV2() {
  const prefersReduced = useReducedMotion();
  const scrollRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const staticEnd = useMotionValue(1);
  const sceneProgress = prefersReduced ? staticEnd : scrollYProgress;

  const blueprintOpacity = useTransform(scrollYProgress, [0, 0.35, 0.65], [1, 0.55, 0.15]);

  return (
    <section
      ref={scrollRef}
      id="how-it-works"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
      className="relative isolate"
      aria-label="How it works"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          style={{ opacity: blueprintOpacity }}
          className="desk-evolution-blueprint pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute inset-0 z-[1]">
          <DeskEvolutionCanvas
            scrollProgress={sceneProgress}
            className="site-evolution-stage--scroll h-full w-full"
          />
        </div>

        {!prefersReduced && <EraLabel scrollYProgress={scrollYProgress} />}

        {prefersReduced ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center gap-6 px-6 py-24 lg:px-16">
            {HOW_IT_WORKS_BLOCKS.map((block) => (
              <RocketTextBlock
                key={block.id}
                block={block}
                scrollYProgress={scrollYProgress}
                prefersReduced
              />
            ))}
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-0 z-10">
            {HOW_IT_WORKS_BLOCKS.map((block) => (
              <RocketTextBlock
                key={block.id}
                block={block}
                scrollYProgress={scrollYProgress}
                prefersReduced={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
