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
  borderRadius?: string;
};

const CURSOR_PILL_SELECTOR = [
  "[data-cursor-pill]",
  "button",
  "input[type='button']",
  "input[type='submit']",
  "input[type='reset']",
  "a[href][role='button']",
  "a[href][class*='agency-button']",
  "a[href][class*='inline-flex'][class*='rounded']",
].join(", ");

function hasVisibleFrame(el: HTMLElement) {
  const styles = window.getComputedStyle(el);
  const borderWidth =
    parseFloat(styles.borderTopWidth) +
    parseFloat(styles.borderRightWidth) +
    parseFloat(styles.borderBottomWidth) +
    parseFloat(styles.borderLeftWidth);

  const hasBorder = styles.borderStyle !== "none" && borderWidth > 0;
  const hasBackground = styles.backgroundColor !== "rgba(0, 0, 0, 0)" && styles.backgroundColor !== "transparent";

  return hasBorder || hasBackground;
}

export default function CursorFollower() {
  const prefersReduced = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pillRect, setPillRect] = useState<PillRect | null>(null);
  const hoveredPillRef = useRef<HTMLElement | null>(null);
  const enabled = !prefersReduced && isFinePointer;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const mainX = useMotionValue(-100);
  const mainY = useMotionValue(-100);

  const mainXSoft = useSpring(mainX, { stiffness: 380, damping: 34, mass: 0.32 });
  const mainYSoft = useSpring(mainY, { stiffness: 380, damping: 34, mass: 0.32 });
  const xTrail = useSpring(x, { stiffness: 240, damping: 28, mass: 0.35 });
  const yTrail = useSpring(y, { stiffness: 240, damping: 28, mass: 0.35 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const initId = window.setTimeout(() => {
      setIsFinePointer(!mq.matches);
    }, 0);
    const onChange = (event: MediaQueryListEvent) => {
      setIsFinePointer(!event.matches);
    };

    mq.addEventListener("change", onChange);

    return () => {
      window.clearTimeout(initId);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const setFromPill = (pill: HTMLElement | null) => {
      hoveredPillRef.current = pill;

      if (!pill) {
        setPillRect(null);
        return;
      }

      const rect = pill.getBoundingClientRect();
      const styles = window.getComputedStyle(pill);
      const framed = hasVisibleFrame(pill);
      const padX = framed ? 0 : 20;
      const padY = framed ? 0 : 10;
      const nextRect = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width + padX,
        height: rect.height + padY,
        borderRadius: framed ? styles.borderRadius : undefined,
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
      const pill = target?.closest(CURSOR_PILL_SELECTOR) as HTMLElement | null;

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
  }, [enabled, mainX, mainY, x, y]);

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
    <div className="pointer-events-none fixed inset-0 z-45">
      <motion.div
        style={{ x: xTrail, y: yTrail }}
        animate={{ opacity: visible && !pillRect ? 0.35 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-agency-ink/40"
      />
      <motion.div
        style={{
          x: pillRect ? mainXSoft : x,
          y: pillRect ? mainYSoft : y,
          borderRadius: pillRect?.borderRadius,
        }}
        animate={{
          opacity: visible ? 1 : 0,
          width: pillRect ? pillRect.width : 10,
          height: pillRect ? pillRect.height : 10,
        }}
        transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.45 }}
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2",
          pillRect
            ? cn(
              "border border-agency-ink/45 bg-transparent",
              !pillRect.borderRadius && "rounded-full",
            )
            : "rounded-full bg-agency-ink",
        )}
      />
    </div>
  );
}
