"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Badge } from "@/components/ui/Badge";

/* ────────────────────────────────────────────────────────────
   Hero — PRD §4.2.2
   Full viewport height. Dark bg + subtle CSS noise/grain.
   Left 60 %: copy, CTAs, trust badges
   Right 40 %: animated browser mockup cycling 3 demo sites
   ──────────────────────────────────────────────────────────── */

/* ── Trust-row items ────────────────────────────────────────── */
const TRUST_ITEMS: { label: string; icon: React.ReactNode }[] = [
  {
    label: "Lighthouse 100/100",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 3v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Custom code, no templates",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M5.5 4L2 8l3.5 4M10.5 4L14 8l-3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Melbourne-based",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5C5.5 1.5 3.5 3.7 3.5 6.5C3.5 10.5 8 14.5 8 14.5C8 14.5 12.5 10.5 12.5 6.5C12.5 3.7 10.5 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="8" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

/* ── Browser-mockup demo data ───────────────────────────────── */
interface DemoPreview {
  name: string;
  url: string;
  tier: string;
  tierColor: string;
  bgClass: string;
  content: React.ReactNode;
}

const DEMO_PREVIEWS: DemoPreview[] = [
  {
    name: "Hearthstone Café",
    url: "heartstonecafe.com.au",
    tier: "Starter",
    tierColor: "text-agency-accent",
    bgClass: "bg-gradient-to-br from-[#faf7f2] to-[#e8e0d5]",
    content: (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-4 text-center">
        <span className="font-serif text-lg font-bold text-[#1c1612]">
          HEARTHSTONE
        </span>
        <span className="text-xs uppercase tracking-widest text-[#7a6a5f]">
          Café · Fitzroy
        </span>
        <div className="h-px w-12 bg-[#8b5e3c]/40" />
        <p className="text-xs text-[#7a6a5f] max-w-45 leading-relaxed">
          Where Fitzroy comes for its morning ritual.
        </p>
        <div className="flex gap-2 mt-1">
          <span className="rounded-full bg-[#8b5e3c] px-3 py-1 text-[10px] font-medium text-white">
            View Menu
          </span>
          <span className="rounded-full border border-[#8b5e3c] px-3 py-1 text-[10px] font-medium text-[#8b5e3c]">
            Find Us
          </span>
        </div>
      </div>
    ),
  },
  {
    name: "Apex Electrical",
    url: "apexelectrical.com.au",
    tier: "Business",
    tierColor: "text-agency-accent2",
    bgClass: "bg-gradient-to-br from-[#f8f9fa] to-[#e2e8f0]",
    content: (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-4 text-center">
        <div className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M8 1L5 7h4l-3 6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-lg font-bold text-[#0f172a] tracking-tight">
            APEX ELECTRICAL
          </span>
        </div>
        <span className="text-xs uppercase tracking-widest text-[#64748b]">
          Licensed Electricians · Richmond
        </span>
        <div className="h-px w-12 bg-[#1d4ed8]/30" />
        <p className="text-xs text-[#64748b] max-w-45 leading-relaxed">
          Reliable electrical work, done right the first time.
        </p>
        <div className="flex gap-2 mt-1">
          <span className="rounded-full bg-[#f59e0b] px-3 py-1 text-[10px] font-bold text-[#0f172a]">
            Get a Quote
          </span>
          <span className="rounded-full border border-[#1d4ed8] px-3 py-1 text-[10px] font-medium text-[#1d4ed8]">
            Call Now
          </span>
        </div>
      </div>
    ),
  },
  {
    name: "Lumina Med Spa",
    url: "luminamedspa.com.au",
    tier: "Premium",
    tierColor: "text-agency-accent3",
    bgClass: "bg-gradient-to-br from-[#fdfcfb] to-[#ede5e9]",
    content: (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-4 text-center">
        <span className="text-lg font-light tracking-[0.2em] text-[#1a1118] uppercase">
          Lumina
        </span>
        <span className="text-xs tracking-widest text-[#8b7a83] uppercase">
          Med Spa · South Yarra
        </span>
        <div className="h-px w-12 bg-[#c9a96e]/50" />
        <p className="text-xs text-[#8b7a83] max-w-45 leading-relaxed italic">
          Refined aesthetics. Transformative results.
        </p>
        <div className="flex gap-2 mt-1">
          <span className="rounded-full bg-[#9d6e82] px-3 py-1 text-[10px] font-medium text-white">
            Book Now
          </span>
          <span className="rounded-full border border-[#c9a96e] px-3 py-1 text-[10px] font-medium text-[#c9a96e]">
            Treatments
          </span>
        </div>
      </div>
    ),
  },
];

/* ── Framer Motion variants (§3.4) ──────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ── Component ─────────────────────────────────────────────── */
export default function Hero() {
  const prefersReduced = useReducedMotion();
  const [activeDemo, setActiveDemo] = useState(0);

  /* Cycle through demos every 3 s */
  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setActiveDemo((i) => (i + 1) % DEMO_PREVIEWS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const noMotionVariants: Variants = {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0 },
  };

  const variants = prefersReduced ? noMotionVariants : containerVariants;
  const child = prefersReduced ? noMotionVariants : fadeUp;

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-agency-bg"
      aria-label="Hero"
    >
      {/* ── Noise / grain overlay (CSS-only, PRD: no heavy canvas) ─ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Content grid ─────────────────────────────────────── */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 py-32 lg:grid-cols-[1fr_0.67fr] lg:gap-16 lg:px-12 lg:py-0">
        {/* ── Left column (60 %) ──────────────────────────────── */}
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center"
        >
          {/* Overline */}
          <motion.p
            variants={child}
            className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-agency-accent"
          >
            Melbourne Web Development
          </motion.p>

          {/* H1 */}
          <motion.h1
            variants={child}
            className="font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl"
          >
            Custom websites that
            <br />
            <span className="text-agency-accent">
              actually win customers.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={child}
            className="mt-6 max-w-xl text-lg leading-relaxed text-agency-muted"
          >
            I build hand-coded, bespoke websites and manage social media for
            Melbourne businesses that are ready to grow their online presence.
            No&nbsp;templates. No&nbsp;WordPress. Just fast, modern, custom
            work.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={child}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/#tiers"
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium",
                "bg-agency-accent text-agency-bg",
                "transition-all duration-150 hover:brightness-90 active:scale-[0.98]",
              )}
            >
              See our work
            </Link>
            <Link
              href="/#how-it-works"
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium",
                "border border-agency-border text-agency-text bg-transparent",
                "transition-all duration-150 hover:bg-agency-surface active:scale-[0.98]",
              )}
            >
              How it works
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.div
            variants={child}
            className="mt-10 flex flex-wrap gap-3"
          >
            {TRUST_ITEMS.map((item) => (
              <Badge
                key={item.label}
                color="muted"
                variant="outline"
                size="sm"
              >
                <span className="text-agency-accent">{item.icon}</span>
                {item.label}
              </Badge>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right column (40 %) — Browser mockup ────────────── */}
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { duration: 0.4, ease: "easeOut", delay: 0.3 }
          }
          className="flex items-center justify-center"
        >
          <BrowserMockup
            demos={DEMO_PREVIEWS}
            activeIndex={activeDemo}
            onSelect={setActiveDemo}
            prefersReduced={prefersReduced}
          />
        </motion.div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────── */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={prefersReduced ? { duration: 0 } : { delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-xs text-agency-muted">Scroll</span>
        <motion.span
          animate={prefersReduced ? {} : { y: [0, 6, 0] }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { repeat: Infinity, duration: 1.4, ease: "easeInOut" }
          }
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 6l4 4 4-4" stroke="var(--agency-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   BrowserMockup — sub-component
   Cycles through demo previews with a crossfade.
   URL bar updates to match the active demo.
   ═══════════════════════════════════════════════════════════ */
interface BrowserMockupProps {
  demos: DemoPreview[];
  activeIndex: number;
  onSelect: (i: number) => void;
  prefersReduced: boolean;
}

function BrowserMockup({
  demos,
  activeIndex,
  onSelect,
  prefersReduced,
}: BrowserMockupProps) {
  const active = demos[activeIndex];

  return (
    <div className="w-full max-w-md">
      {/* Chrome */}
      <div className="rounded-t-xl border border-b-0 border-agency-border bg-agency-surface px-4 py-3">
        {/* Traffic lights + URL bar */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 rounded-md bg-agency-surface2 px-3 py-1.5 text-xs text-agency-muted font-mono truncate">
            <AnimatePresence mode="wait">
              <motion.span
                key={active.url}
                initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? {} : { opacity: 0, y: -6 }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { duration: 0.25, ease: "easeOut" }
                }
                className="block"
              >
                {active.url}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Viewport */}
      <div className="relative aspect-4/3 overflow-hidden rounded-b-xl border border-agency-border bg-agency-surface2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={prefersReduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? {} : { opacity: 0 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { duration: 0.5, ease: "easeInOut" }
            }
            className={cn("absolute inset-0", active.bgClass)}
          >
            {active.content}
          </motion.div>
        </AnimatePresence>

        {/* Tier label overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className={cn(
              "rounded-full bg-agency-bg/80 backdrop-blur px-3 py-1 text-[11px] font-medium",
              active.tierColor,
            )}
          >
            {active.tier} Tier
          </span>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="mt-4 flex justify-center gap-2">
        {demos.map((d, i) => (
          <button
            key={d.name}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Show ${d.name} preview`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === activeIndex
                ? "w-6 bg-agency-accent"
                : "w-2 bg-agency-border hover:bg-agency-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}
