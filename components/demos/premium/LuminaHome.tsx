"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   LuminaHome — PRD §9
   Sections:
   1. Hero — split-text reveal, parallax blob, magnetic CTA
   2. Introduction strip — 3 columns on dark bg
   3. Signature Treatments — 6 treatment cards with hover
   4. Philosophy — 2-column editorial
   5. Testimonials carousel — auto-advance 5s, cross-fade
   6. Awards marquee
   ──────────────────────────────────────────────────────────── */

/* ── Data ──────────────────────────────────────────────────── */

const treatments = [
  {
    name: "Anti-Wrinkle Injections",
    category: "Injectables",
    price: "From $350",
    gradient: "from-[#9d6e82] to-[#7a4f61]",
  },
  {
    name: "Dermal Fillers",
    category: "Injectables",
    price: "From $650",
    gradient: "from-[#c9a96e] to-[#9d6e82]",
  },
  {
    name: "HydraFacial",
    category: "Skin Treatments",
    price: "From $280",
    gradient: "from-[#e8d0d8] to-[#9d6e82]",
  },
  {
    name: "Laser Skin Resurfacing",
    category: "Advanced Skin",
    price: "From $450",
    gradient: "from-[#7a4f61] to-[#1a1118]",
  },
  {
    name: "Body Contouring",
    category: "Body",
    price: "From $600",
    gradient: "from-[#c9a96e] to-[#7a4f61]",
  },
  {
    name: "Collagen Induction Therapy",
    category: "Skin Treatments",
    price: "From $320",
    gradient: "from-[#9d6e82] to-[#c9a96e]",
  },
];

const testimonials = [
  {
    text: "I was nervous about injectables but the team at Lumina made me feel completely at ease. My results look so natural — exactly what I asked for.",
    name: "Sophie",
    suburb: "South Yarra",
    treatment: "Anti-Wrinkle Injections",
  },
  {
    text: "Three years as a Lumina client and I've never once felt pressured into a treatment. They genuinely listen to what you want.",
    name: "Catherine",
    suburb: "Toorak",
    treatment: "Dermal Fillers",
  },
  {
    text: "The HydraFacial is absolutely incredible. My skin has never looked better. I book one every 6 weeks.",
    name: "Jade",
    suburb: "Prahran",
    treatment: "HydraFacial",
  },
  {
    text: "Professional, clinical, and warm all at once. The clinic itself is beautiful and the results speak for themselves.",
    name: "Amanda",
    suburb: "Richmond",
    treatment: "Laser Skin Resurfacing",
  },
  {
    text: "Finally a clinic where they tell me what I DON'T need as well as what I do. Trust is everything and I trust Lumina.",
    name: "Michelle",
    suburb: "Windsor",
    treatment: "Collagen Induction Therapy",
  },
  {
    text: "My anti-wrinkle treatment is so natural. My colleagues think I just look 'refreshed'. Which is exactly the point.",
    name: "Karen",
    suburb: "Hawthorn",
    treatment: "Anti-Wrinkle Injections",
  },
];

const marqueeItems = [
  { text: "VOGUE AUSTRALIA", font: "display-italic" },
  { text: "THE URBAN LIST", font: "body-upper" },
  { text: "TIME OUT MELBOURNE", font: "body-upper" },
  { text: "BEST OF SOUTH YARRA 2024", font: "display-italic" },
  { text: "COSMETIC NURSES ASSOCIATION", font: "body-upper" },
];

/* ── Sub-components ─────────────────────────────────────────── */

function TreatmentCard({
  treatment,
  prefersReduced,
}: {
  treatment: (typeof treatments)[0];
  prefersReduced: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-linear-to-b ${treatment.gradient}`}
      />
      {/* Dark base overlay */}
      <div className="absolute inset-0 bg-black/20" />
      {/* Hover overlay darkens */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="font-(family-name:--font-lm-body) text-xs uppercase tracking-[0.15em] text-[#c9a96e]">
          {treatment.category}
        </p>
        <h3 className="mt-1 font-(family-name:--font-lm-display) text-xl font-light text-white">
          {treatment.name}
        </h3>
        <p className="mt-1 font-(family-name:--font-lm-body) text-xs text-white/60">
          {treatment.price}
        </p>
        <AnimatePresence>
          {hovered && !prefersReduced && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <Link
                href="/demo/premium/treatments"
                className="inline-block rounded-full border border-white/60 px-4 py-2 font-(family-name:--font-lm-body) text-xs text-white hover:bg-white/10"
              >
                Learn More →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* Magnetic CTA button */
function MagneticButton({ prefersReduced }: { prefersReduced: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (prefersReduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * 0.25);
      y.set((e.clientY - cy) * 0.25);
    },
    [prefersReduced, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href="/demo/premium/book"
      style={prefersReduced ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block rounded-full bg-[#c9a96e] px-8 py-4 font-(family-name:--font-lm-body) text-sm font-medium text-[#1a1118] transition-colors hover:bg-[#d4b87e]"
    >
      Book a Consultation
    </motion.a>
  );
}

/* ── Main component ─────────────────────────────────────────── */

export default function LuminaHome() {
  const prefersReduced = useReducedMotion();

  /* ── Parallax ─────────────────────────────────── */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -180]);
  const philosophyImgY = useTransform(scrollY, [400, 1400], [0, prefersReduced ? 0 : -60]);

  /* ── Testimonials ─────────────────────────────── */
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  /* keyboard navigation */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setActiveIdx((i) => (i + 1) % testimonials.length);
      if (e.key === "ArrowLeft")
        setActiveIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
    },
    []
  );

  /* ── Split-text helper ────────────────────────── */
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.2 + i * 0.05,
      },
    }),
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const fadeUpSimple = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const words1 = ["Confidence,"];
  const words2 = ["refined."];

  return (
    <main role="main">
      {/* ════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden bg-[#fdfcfb]"
        aria-label="Hero"
      >
        {/* Blobs */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-[60vw] w-[60vw] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, #e8d0d8 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute left-0 top-0 h-[25vw] w-[25vw] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, #f0e6d3 0%, transparent 70%)",
          }}
        />
        {/* Gold rule */}
        <div
          className="pointer-events-none absolute left-0 right-0 h-px bg-[#c9a96e]/50"
          style={{ top: "62%" }}
        />

        {/* Parallax circle composition — right side */}
        <motion.div
          style={{ y: blobY }}
          className="pointer-events-none absolute -right-24 top-20 h-[520px] w-[520px] overflow-hidden rounded-full border border-[#c9a96e]/40 lg:-right-8 lg:top-16"
        >
          <div className="h-full w-full bg-linear-to-br from-[#e8d0d8] via-[#c9a96e]/30 to-[#f0e6d3]" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-16 pt-32 lg:px-24 lg:pt-40">
          {/* Split-text H1 */}
          <motion.div
            variants={prefersReduced ? undefined : stagger}
            initial={prefersReduced ? undefined : "hidden"}
            animate="visible"
            aria-label="Confidence, refined."
          >
            <div className="overflow-hidden">
              {words1.map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  variants={prefersReduced ? undefined : fadeUp}
                  className="block font-(family-name:--font-lm-display) text-7xl font-light leading-none text-[#1a1118] md:text-8xl lg:text-9xl"
                  aria-hidden="true"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="overflow-hidden">
              {words2.map((word, i) => (
                <motion.span
                  key={word}
                  custom={words1.length + i}
                  variants={prefersReduced ? undefined : fadeUp}
                  className="block font-(family-name:--font-lm-display) text-7xl font-light italic leading-none text-[#c9a96e] md:text-8xl lg:text-9xl"
                  aria-hidden="true"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Gold rule */}
          <motion.div
            initial={prefersReduced ? undefined : { scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 h-px w-10 bg-[#c9a96e]"
          />

          {/* Body */}
          <motion.p
            initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-6 max-w-md font-(family-name:--font-lm-body) text-base font-light leading-relaxed text-[#2d2228]/70"
          >
            Lumina is South Yarra&apos;s premium medical aesthetics clinic. Led by
            registered practitioners, specialising in natural results that
            enhance rather than alter.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            <MagneticButton prefersReduced={prefersReduced} />
            <Link
              href="/demo/premium/treatments"
              className="group font-(family-name:--font-lm-body) text-sm text-[#2d2228] underline-offset-4 hover:underline"
            >
              Explore Treatments →
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div
            className="h-10 w-px bg-[#c9a96e]"
            animate={prefersReduced ? undefined : { opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <div className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]" />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          INTRODUCTION STRIP
          ════════════════════════════════════════════ */}
      <section className="bg-[#1a1118] py-20">
        <motion.div
          variants={prefersReduced ? undefined : stagger}
          initial={prefersReduced ? undefined : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mx-auto grid max-w-7xl gap-px px-6 md:grid-cols-3 lg:px-12"
        >
          {[
            {
              title: "A Medical Approach",
              body: "All treatments are performed or supervised by registered medical practitioners. Your safety is non-negotiable.",
            },
            {
              title: "Natural Results",
              body: "We believe in enhancement, not transformation. Every treatment plan starts with listening.",
            },
            {
              title: "South Yarra's Trust",
              body: "Serving the South Yarra community since 2017. Over 3,000 clients, and counting.",
            },
          ].map((col, idx) => (
            <motion.div
              key={col.title}
              variants={prefersReduced ? undefined : fadeUpSimple}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
              className={`px-8 py-12 ${idx < 2 ? "md:border-r md:border-[#c9a96e]/20" : ""}`}
            >
              <h3 className="font-(family-name:--font-lm-display) text-xl font-light text-white">
                {col.title}
              </h3>
              <p className="mt-3 font-(family-name:--font-lm-body) text-sm leading-relaxed text-white/50">
                {col.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          SIGNATURE TREATMENTS
          ════════════════════════════════════════════ */}
      <section className="bg-[#fdfcfb] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div
            variants={prefersReduced ? undefined : stagger}
            initial={prefersReduced ? undefined : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="text-center"
          >
            <motion.h2
              variants={prefersReduced ? undefined : fadeUpSimple}
              transition={{ duration: 0.4 }}
              className="font-(family-name:--font-lm-display) text-4xl font-light text-[#1a1118] md:text-5xl"
            >
              Our signature treatments
            </motion.h2>
            <motion.p
              variants={prefersReduced ? undefined : fadeUpSimple}
              transition={{ duration: 0.4 }}
              className="mt-2 font-(family-name:--font-lm-display) text-xl italic text-[#8b7a83]"
            >
              Each tailored to you.
            </motion.p>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {treatments.map((t) => (
              <TreatmentCard
                key={t.name}
                treatment={t}
                prefersReduced={prefersReduced}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PHILOSOPHY
          ════════════════════════════════════════════ */}
      <section className="bg-[#fdfcfb] py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[45%_55%] lg:px-12">
          {/* Left — parallax editorial composition */}
          <motion.div
            style={{ y: philosophyImgY }}
            className="hidden lg:block"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-xl border border-[#c9a96e]/30 bg-linear-to-br from-[#e8d0d8] via-[#c9a96e]/20 to-[#f0e6d3]">
              <div className="flex h-full items-center justify-center">
                <span className="font-(family-name:--font-lm-body) text-xs uppercase tracking-widest text-[#8b7a83]/40">
                  Clinic Interior
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            variants={prefersReduced ? undefined : stagger}
            initial={prefersReduced ? undefined : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col justify-center"
          >
            <motion.p
              variants={prefersReduced ? undefined : fadeUpSimple}
              transition={{ duration: 0.4 }}
              className="font-(family-name:--font-lm-body) text-xs uppercase tracking-[0.2em] text-[#c9a96e]"
            >
              The Lumina Philosophy
            </motion.p>
            <motion.h2
              variants={prefersReduced ? undefined : fadeUpSimple}
              transition={{ duration: 0.4 }}
              className="mt-3 font-(family-name:--font-lm-display) text-3xl font-light text-[#1a1118] md:text-4xl"
            >
              Beautiful results start with honest conversations.
            </motion.h2>
            <div className="mt-5 space-y-4 font-(family-name:--font-lm-body) text-base leading-relaxed text-[#8b7a83]">
              <motion.p variants={prefersReduced ? undefined : fadeUpSimple} transition={{ duration: 0.4 }}>
                At Lumina, we have never believed in the one-size-fits-all
                approach to aesthetics. Every face is different. Every client
                has a different goal — and often, the goal is simply to feel
                like themselves again.
              </motion.p>
              <motion.p variants={prefersReduced ? undefined : fadeUpSimple} transition={{ duration: 0.4 }}>
                We start every relationship with a thorough consultation. No
                treatment is recommended without understanding your health
                history, your expectations, and your timeline.
              </motion.p>
              <motion.p variants={prefersReduced ? undefined : fadeUpSimple} transition={{ duration: 0.4 }}>
                Our practitioners will always tell you what you don&apos;t need.
                That honesty is what keeps our clients coming back for years.
              </motion.p>
            </div>
            <motion.div variants={prefersReduced ? undefined : fadeUpSimple} transition={{ duration: 0.4 }} className="mt-6">
              <Link
                href="/demo/premium/about"
                className="font-(family-name:--font-lm-body) text-sm text-[#9d6e82] underline-offset-4 hover:underline"
              >
                Meet our practitioners →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TESTIMONIALS CAROUSEL
          ════════════════════════════════════════════ */}
      <section
        className="bg-[#1a1118] py-20 lg:py-28"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label="Client testimonials"
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-(family-name:--font-lm-display) text-4xl font-light text-white md:text-5xl">
            What our clients say
          </h2>
        </div>

        <div
          className="relative mx-auto mt-12 max-w-2xl px-6"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={prefersReduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <span
                className="font-(family-name:--font-lm-display) text-[120px] leading-none text-[#c9a96e] opacity-40"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="mt-[-40px] font-(family-name:--font-lm-body) text-lg font-light leading-relaxed text-white/80">
                {testimonials[activeIdx].text}
              </p>
              <div className="mt-6 flex justify-center gap-1" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-[#c9a96e]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mt-4 font-(family-name:--font-lm-body) text-sm font-medium text-[#c9a96e]">
                {testimonials[activeIdx].name}, {testimonials[activeIdx].suburb}
              </p>
              <p className="font-(family-name:--font-lm-body) text-xs text-white/40">
                {testimonials[activeIdx].treatment}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIdx ? "w-6 bg-[#c9a96e]" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          AWARDS MARQUEE
          ════════════════════════════════════════════ */}
      <section className="overflow-hidden border-y border-[#ede5e9] bg-[#fdfcfb] py-6">
        <div className="flex animate-marquee items-center gap-16 whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className={
                item.font === "display-italic"
                  ? "font-(family-name:--font-lm-display) text-lg italic text-[#8b7a83]"
                  : "font-(family-name:--font-lm-body) text-xs uppercase tracking-[0.2em] text-[#8b7a83]"
              }
            >
              {item.text}
              <span className="mx-8 text-[#c9a96e]">·</span>
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
