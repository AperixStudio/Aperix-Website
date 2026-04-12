"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   StatCounters — PRD §8.3.2
   Animated stat counters that count up from 0 when scrolled
   into view: 10+ Years · 500+ Jobs · 4.9★ · $20M Insured
   ──────────────────────────────────────────────────────────── */

interface Stat {
  label: string;
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const stats: Stat[] = [
  { label: "Years Experience", end: 10, suffix: "+" },
  { label: "Jobs Completed", end: 500, suffix: "+" },
  { label: "Google Rating", end: 4.9, suffix: "★", decimals: 1 },
  { label: "Insured", end: 20, prefix: "$", suffix: "M" },
];

function useCountUp(
  end: number,
  inView: boolean,
  duration: number,
  decimals: number
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const start = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setValue(Number(current.toFixed(decimals)));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [inView, end, duration, decimals]);

  return value;
}

function Counter({
  stat,
  inView,
  prefersReduced,
}: {
  stat: Stat;
  inView: boolean;
  prefersReduced: boolean;
}) {
  const decimals = stat.decimals ?? 0;
  const value = useCountUp(
    stat.end,
    inView,
    prefersReduced ? 0 : 1500,
    decimals
  );
  const display = prefersReduced && inView ? stat.end.toFixed(decimals) : value.toFixed(decimals);

  return (
    <div className="text-center">
      <p className="font-(family-name:--font-apex-display) text-4xl font-bold text-[#1d4ed8] md:text-5xl">
        {stat.prefix}
        {display}
        {stat.suffix}
      </p>
      <p className="mt-2 font-(family-name:--font-apex-body) text-sm font-medium text-[#64748b]">
        {stat.label}
      </p>
    </div>
  );
}

export default function StatCounters() {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const motionProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 } as const,
        whileInView: { opacity: 1, y: 0 } as const,
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const },
      };

  return (
    <section className="bg-white py-16 lg:py-20">
      <motion.div
        ref={ref}
        className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 lg:grid-cols-4"
        {...motionProps}
      >
        {stats.map((stat) => (
          <Counter
            key={stat.label}
            stat={stat}
            inView={inView}
            prefersReduced={prefersReduced}
          />
        ))}
      </motion.div>
    </section>
  );
}
