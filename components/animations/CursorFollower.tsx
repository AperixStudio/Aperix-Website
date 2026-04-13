"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

type PillRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function CursorFollower() {
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pillRect, setPillRect] = useState<PillRect | null>(null);
  const hoveredPillRef = useRef<HTMLElement | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const mainX = useMotionValue(-100);
  const mainY = useMotionValue(-100);

  const xSoft = useSpring(x, { stiffness: 220, damping: 28, mass: 0.4 });
  const ySoft = useSpring(y, { stiffness: 220, damping: 28, mass: 0.4 });
  const mainXSoft = useSpring(mainX, { stiffness: 260, damping: 30, mass: 0.45 });
  const mainYSoft = useSpring(mainY, { stiffness: 260, damping: 30, mass: 0.45 });
  const xTrail = useSpring(x, { stiffness: 120, damping: 24, mass: 0.7 });
  const yTrail = useSpring(y, { stiffness: 120, damping: 24, mass: 0.7 });

  useEffect(() => {
    if (prefersReduced) {
      setEnabled(false);
      setVisible(false);
      return;
    }

    const mq = window.matchMedia("(pointer: coarse)");
    if (mq.matches) {
      setEnabled(false);
      setVisible(false);
      return;
    }

    setEnabled(true);

    const setFromPill = (pill: HTMLElement | null) => {
      hoveredPillRef.current = pill;

      if (!pill) {
        setPillRect(null);
        return;
      }

      const rect = pill.getBoundingClientRect();
      const nextRect = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width + 20,
        height: rect.height + 10,
      };

      setPillRect(nextRect);
      mainX.set(nextRect.x);
      mainY.set(nextRect.y);
    };

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const target = event.target instanceof Element ? event.target : null;
      const pill = target?.closest("[data-cursor-pill]") as HTMLElement | null;

      if (pill !== hoveredPillRef.current) {
        setFromPill(pill);
      } else if (!pill) {
        mainX.set(event.clientX);
        mainY.set(event.clientY);
      } else {
        const rect = pill.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        mainX.set(cx);
        mainY.set(cy);
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onViewportChange = () => {
      if (!hoveredPillRef.current) return;
      setFromPill(hoveredPillRef.current);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerenter", onEnter);
    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [mainX, mainY, prefersReduced, x, y]);

  useEffect(() => {
    if (!enabled) return;
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = "none";
    return () => {
      document.body.style.cursor = prevCursor;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[45]">
      <motion.div
        style={{ x: xTrail, y: yTrail }}
        animate={{ opacity: visible && !pillRect ? 0.35 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-agency-ink/40"
      />
      <motion.div
        style={{ x: pillRect ? mainXSoft : xSoft, y: pillRect ? mainYSoft : ySoft }}
        animate={{
          opacity: visible ? 1 : 0,
          width: pillRect ? pillRect.width : 10,
          height: pillRect ? pillRect.height : 10,
        }}
        transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.45 }}
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
          pillRect
            ? "border border-agency-ink/45 bg-transparent"
            : "bg-agency-ink",
        )}
      />
    </div>
  );
}
