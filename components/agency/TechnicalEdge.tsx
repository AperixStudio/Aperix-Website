"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   TechnicalEdge — PRD §4.2.6
   Two-column layout.
   Left  — copy + three metric comparison cards.
   Right — animated code window with syntax-highlighted
           Next.js component, typewriter line reveal.
   ──────────────────────────────────────────────────────────── */

/* ── Metric data ────────────────────────────────────────────── */
interface Metric {
  label: string;
  score: string;
  color: string;        /* Tailwind text-* class */
  barColor: string;     /* Tailwind bg-* class */
  barWidth: string;     /* Tailwind w-* class */
}

const METRICS: Metric[] = [
  {
    label: "Typical WordPress Site",
    score: "42/100 mobile speed",
    color: "text-red-500",
    barColor: "bg-red-500",
    barWidth: "w-[42%]",
  },
  {
    label: "Typical Squarespace Site",
    score: "58/100 mobile speed",
    color: "text-agency-accent2",
    barColor: "bg-agency-accent2",
    barWidth: "w-[58%]",
  },
  {
    label: "Our Custom Builds",
    score: "100/100 mobile speed",
    color: "text-emerald-400",
    barColor: "bg-emerald-400",
    barWidth: "w-full",
  },
];

/* ── Framer variants (§3.4) ─────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Code-window line variants ──────────────────────────────── */
const lineVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const codeContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

/* ── Component ─────────────────────────────────────────────── */
export default function TechnicalEdge() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="bg-agency-surface px-6 py-20 lg:px-12 lg:py-32"
      aria-labelledby="tech-edge-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        {/* ════════════════════════════════════════════════════
           LEFT COLUMN — text + metrics
           ════════════════════════════════════════════════════ */}
        <motion.div
          variants={prefersReduced ? undefined : staggerContainer}
          initial={prefersReduced ? undefined : "hidden"}
          whileInView={prefersReduced ? undefined : "visible"}
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.h2
            id="tech-edge-heading"
            variants={prefersReduced ? undefined : fadeUp}
            className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl"
          >
            Built differently from the&nbsp;start.
          </motion.h2>

          <motion.p
            variants={prefersReduced ? undefined : fadeUp}
            className="mt-5 max-w-lg text-base leading-relaxed text-agency-muted sm:text-lg"
          >
            Most agencies drop your content into a template and call it done.
            We write every line of code from scratch — which means your site
            loads faster, ranks higher on Google, and belongs entirely to you.
            No platform lock&#8209;in, no bloated plugins, no compromise.
          </motion.p>

          {/* ── Metric cards ─────────────────────────────────── */}
          <div className="mt-10 flex flex-col gap-4">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                variants={prefersReduced ? undefined : fadeUp}
                className="rounded-xl border border-agency-border bg-agency-bg p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-agency-muted">{m.label}</span>
                  <span className={cn("text-sm font-semibold", m.color)}>
                    {m.score}
                    {/* Sparkle on the green row */}
                    {i === 2 && (
                      <span className="ml-1.5 inline-block" aria-hidden="true">
                        ✦
                      </span>
                    )}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 w-full rounded-full bg-agency-surface2">
                  <motion.div
                    initial={prefersReduced ? undefined : { width: 0 }}
                    whileInView={prefersReduced ? undefined : { width: "var(--bar-w)" }}
                    viewport={{ once: true }}
                    transition={
                      prefersReduced
                        ? undefined
                        : { duration: 0.6, ease: "easeOut", delay: 0.15 + i * 0.12 }
                    }
                    className={cn("h-full rounded-full", m.barColor, m.barWidth)}
                    style={{ "--bar-w": m.barWidth === "w-full" ? "100%" : m.barWidth.replace("w-[", "").replace("]", "") } as React.CSSProperties}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════
           RIGHT COLUMN — animated code window
           ════════════════════════════════════════════════════ */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={prefersReduced ? undefined : { duration: 0.4, ease: "easeOut" }}
        >
          <CodeWindow prefersReduced={prefersReduced} />
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   CodeWindow — sub-component
   Realistic Next.js page component with manual syntax
   highlighting via inline styled spans. Lines appear
   sequentially (typewriter stagger).
   ═══════════════════════════════════════════════════════════ */

/* Colour tokens for manual syntax highlighting */
const S = {
  kw:  "text-[#c678dd]",   /* keyword  — purple  */
  fn:  "text-[#61afef]",   /* function — blue    */
  str: "text-[#98c379]",   /* string   — green   */
  typ: "text-[#e5c07b]",   /* type     — yellow  */
  cm:  "text-[#5c6370]",   /* comment  — grey    */
  op:  "text-[#56b6c2]",   /* operator — teal    */
  tag: "text-[#e06c75]",   /* JSX tag  — red     */
  attr:"text-[#d19a66]",   /* attribute — orange  */
  txt: "text-[#abb2bf]",   /* plain    — grey    */
  num: "text-[#d19a66]",   /* number   — orange  */
} as const;

/**
 * Each "line" is an array of {text, cls} spans.
 * This keeps the highlighting data-driven rather than
 * embedding raw HTML.
 */
interface Span {
  text: string;
  cls: string;
}

type Line = Span[];

const CODE_LINES: Line[] = [
  /* 1  */ [{ text: "// app/page.tsx", cls: S.cm }],
  /* 2  */ [{ text: "import ", cls: S.kw }, { text: "Image ", cls: S.fn }, { text: "from ", cls: S.kw }, { text: "'next/image'", cls: S.str }],
  /* 3  */ [{ text: "import ", cls: S.kw }, { text: "type ", cls: S.kw }, { text: "{ Metadata } ", cls: S.typ }, { text: "from ", cls: S.kw }, { text: "'next'", cls: S.str }],
  /* 4  */ [{ text: "", cls: S.txt }],
  /* 5  */ [{ text: "export ", cls: S.kw }, { text: "const ", cls: S.kw }, { text: "metadata", cls: S.fn }, { text: ": ", cls: S.op }, { text: "Metadata ", cls: S.typ }, { text: "= {", cls: S.txt }],
  /* 6  */ [{ text: "  title: ", cls: S.txt }, { text: "'Aperix Studio — Melbourne Web Dev'", cls: S.str }, { text: ",", cls: S.txt }],
  /* 7  */ [{ text: "  description: ", cls: S.txt }, { text: "'Hand-coded sites that rank.'", cls: S.str }, { text: ",", cls: S.txt }],
  /* 8  */ [{ text: "}", cls: S.txt }],
  /* 9  */ [{ text: "", cls: S.txt }],
  /* 10 */ [{ text: "export default ", cls: S.kw }, { text: "function ", cls: S.kw }, { text: "Home", cls: S.fn }, { text: "() {", cls: S.txt }],
  /* 11 */ [{ text: "  return (", cls: S.txt }],
  /* 12 */ [{ text: "    <", cls: S.txt }, { text: "section ", cls: S.tag }, { text: "className", cls: S.attr }, { text: "=", cls: S.op }, { text: "\"min-h-screen\"", cls: S.str }, { text: ">", cls: S.txt }],
  /* 13 */ [{ text: "      <", cls: S.txt }, { text: "Image", cls: S.tag }],
  /* 14 */ [{ text: "        src", cls: S.attr }, { text: "=", cls: S.op }, { text: "\"/hero.webp\"", cls: S.str }],
  /* 15 */ [{ text: "        width", cls: S.attr }, { text: "=", cls: S.op }, { text: "{1920}", cls: S.num }],
  /* 16 */ [{ text: "        height", cls: S.attr }, { text: "=", cls: S.op }, { text: "{1080}", cls: S.num }],
  /* 17 */ [{ text: "        alt", cls: S.attr }, { text: "=", cls: S.op }, { text: "\"Melbourne skyline\"", cls: S.str }],
  /* 18 */ [{ text: "        priority", cls: S.attr }],
  /* 19 */ [{ text: "      />", cls: S.txt }],
  /* 20 */ [{ text: "    </", cls: S.txt }, { text: "section", cls: S.tag }, { text: ">", cls: S.txt }],
  /* 21 */ [{ text: "  )", cls: S.txt }],
  /* 22 */ [{ text: "}", cls: S.txt }],
];

function CodeWindow({ prefersReduced }: { prefersReduced: boolean }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-agency-border shadow-2xl shadow-black/30">
      {/* ── Title bar ──────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-agency-border bg-agency-surface2 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs text-agency-muted font-mono">page.tsx</span>
      </div>

      {/* ── Code area ──────────────────────────────────────── */}
      <div className="bg-[#1e1e2e] p-5 overflow-x-auto">
        <motion.pre
          variants={prefersReduced ? undefined : codeContainerVariants}
          initial={prefersReduced ? undefined : "hidden"}
          whileInView={prefersReduced ? undefined : "visible"}
          viewport={{ once: true, amount: 0.15 }}
          className="font-mono text-xs leading-6 sm:text-sm sm:leading-7"
        >
          {CODE_LINES.map((line, lineIdx) => (
            <motion.div
              key={lineIdx}
              variants={prefersReduced ? undefined : lineVariants}
              className="whitespace-pre"
            >
              {/* Line number */}
              <span className="mr-5 inline-block w-5 select-none text-right text-agency-muted/40">
                {lineIdx + 1}
              </span>

              {/* Syntax-highlighted spans */}
              {line.map((span, spanIdx) => (
                <span key={spanIdx} className={span.cls}>
                  {span.text}
                </span>
              ))}
            </motion.div>
          ))}
        </motion.pre>
      </div>
    </div>
  );
}
