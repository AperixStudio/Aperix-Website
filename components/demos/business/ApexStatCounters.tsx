"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   ApexStatCounters — PRD §8.3.2
   Animated stat counters that count up from 0 on scroll.
   All animations gated by useReducedMotion.
   ──────────────────────────────────────────────────────────── */

interface Stat {
  target: number;
  suffix: string;
  prefix?: string;
  label: string;
}

const stats: Stat[] = [
  { target: 10, suffix: "+ Years", label: "In Business" },
  { target: 500, suffix: "+ Jobs", label: "Completed" },
  { target: 4.9, suffix: "★", label: "Google Rating" },
  { target: 20, suffix: "M", prefix: "$", label: "Insured" },
];

function useCountUp(target: number, duration: number, active: boolean, prefersReduced: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || prefersReduced) {
      setValue(target);
      return;
    }
    const isDecimal = !Number.isInteger(target);
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;
      setValue(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [active, target, duration, prefersReduced]);

  return value;
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const prefersReduced = useReducedMotion();
  const value = useCountUp(stat.target, 1800, active, prefersReduced);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 px-6 py-8 text-center ring-1 ring-white/10">
      <p className="font-(family-name:--font-apex-heading) text-4xl font-extrabold text-[#f59e0b] md:text-5xl">
        {stat.prefix ?? ""}
        {value}
        {stat.suffix}
      </p>
      <p className="mt-2 font-(family-name:--font-apex-body) text-sm text-white/60">
        {stat.label}
      </p>
    </div>
  );
}

export default function ApexStatCounters() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#0c0a09] py-16" ref={ref}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} active={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
