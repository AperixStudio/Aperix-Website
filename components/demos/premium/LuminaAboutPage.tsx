"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   LuminaAboutPage — PRD §9
   Editorial alternating layout. 3 practitioners. Clinic story.
   ──────────────────────────────────────────────────────────── */

const practitioners = [
  {
    name: "Dr. Amelie Tremblay",
    title: "Lead Injector & Medical Director",
    credentials: "MBBS, Cosmetic Medicine Fellowship",
    gradient: "from-[#e8d0d8] to-[#9d6e82]",
    bio: "Dr. Tremblay leads Lumina's injectable services and oversees clinical governance across all treatments. With a background in cosmetic medicine and over a decade of experience, she has developed a reputation for injections that are precise, conservative, and genuinely natural-looking.",
    bio2: "She completed her Cosmetic Medicine Fellowship in Sydney before returning to Melbourne in 2017 to co-found Lumina with a vision for a clinic that prioritised patient education as much as results.",
    quote:
      "Every client deserves a practitioner who listens first. Results should look like you, only rested.",
  },
  {
    name: "Jessica Park",
    title: "Senior Cosmetic Nurse",
    credentials: "RN, Dermal Therapist Cert IV",
    gradient: "from-[#c9a96e] to-[#9d6e82]",
    bio: "Jessica has been nursing for twelve years, with the last seven focused exclusively on cosmetic medicine. Her approach is methodical and safety-first — she will always conduct a thorough health assessment before recommending any treatment.",
    bio2: "Jessica specialises in lip enhancement, tear trough filler, and anti-wrinkle injections. She is known among her clients for being honest, calming, and meticulous.",
    quote:
      "Safety is everything. I won't perform a treatment I wouldn't recommend to my own family.",
  },
  {
    name: "Chloe Marchand",
    title: "Senior Dermal Clinician",
    credentials: "Diploma of Beauty Therapy, Dermal Therapist Cert IV",
    gradient: "from-[#f0e6d3] to-[#c9a96e]",
    bio: "Chloe leads Lumina's skin health program and oversees all laser, HydraFacial, micro-needling, and LED treatments. She brings a scientific understanding of skin biology to every consultation, creating bespoke skin plans rather than one-size-fits-all packages.",
    bio2: "She is passionate about long-term skin health and works closely with clients over months and years to achieve progressive, sustainable improvements.",
    quote:
      "Skin health is a long game. I focus on building confidence, not chasing perfection.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LuminaAboutPage() {
  const prefersReduced = useReducedMotion();

  const mp = prefersReduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <main role="main">
      {/* Hero */}
      <section className="bg-[#1a1118] pb-20 pt-28">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-(family-name:--font-lm-display) text-5xl font-light text-white md:text-7xl lg:text-8xl">
            The people behind Lumina.
          </h1>
          <p className="mt-4 max-w-lg font-(family-name:--font-lm-body) text-base font-light text-[#c9a96e]">
            Registered practitioners. Honest conversations. Natural results.
          </p>
        </div>
      </section>

      {/* Practitioners — editorial alternating */}
      <section className="bg-[#fdfcfb] py-20 lg:py-28">
        <div className="mx-auto max-w-6xl space-y-24 px-6">
          {practitioners.map((p, idx) => (
            <motion.div
              key={p.name}
              variants={prefersReduced ? undefined : stagger}
              {...mp}
              className={`grid items-center gap-12 lg:grid-cols-2 ${
                idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Portrait placeholder */}
              <motion.div
                variants={prefersReduced ? undefined : fadeUp}
                className="flex justify-center"
              >
                <div
                  className={`h-80 w-80 overflow-hidden rounded-full border border-[#c9a96e]/30 bg-linear-to-br ${p.gradient}`}
                >
                  <div className="flex h-full items-center justify-center">
                    <span className="font-(family-name:--font-lm-body) text-xs uppercase tracking-widest text-white/20">
                      Photo
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Text */}
              <motion.div variants={prefersReduced ? undefined : fadeUp}>
                <h2 className="font-(family-name:--font-lm-display) text-3xl font-light text-[#1a1118] md:text-4xl">
                  {p.name}
                </h2>
                <p className="mt-1 font-(family-name:--font-lm-body) text-sm font-medium text-[#9d6e82]">
                  {p.title}
                </p>
                <p className="font-(family-name:--font-lm-body) text-xs text-[#8b7a83]">
                  {p.credentials}
                </p>
                <div className="mt-4 space-y-3 font-(family-name:--font-lm-body) text-sm leading-relaxed text-[#8b7a83]">
                  <p>{p.bio}</p>
                  <p>{p.bio2}</p>
                </div>
                <blockquote className="mt-6 border-l-2 border-[#c9a96e] pl-4">
                  <p className="font-(family-name:--font-lm-display) text-xl italic text-[#c9a96e]">
                    &ldquo;{p.quote}&rdquo;
                  </p>
                </blockquote>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Clinic story */}
      <section className="bg-[#1a1118] py-20 lg:py-28">
        <motion.div
          variants={prefersReduced ? undefined : stagger}
          {...mp}
          className="mx-auto max-w-4xl px-6"
        >
          <motion.p
            variants={prefersReduced ? undefined : fadeUp}
            className="font-(family-name:--font-lm-body) text-xs uppercase tracking-[0.2em] text-[#c9a96e]"
          >
            Our Story
          </motion.p>
          <motion.h2
            variants={prefersReduced ? undefined : fadeUp}
            className="mt-3 font-(family-name:--font-lm-display) text-3xl font-light text-white md:text-4xl"
          >
            Founded on the belief that aesthetics should feel like you.
          </motion.h2>
          <div className="mt-6 space-y-4 font-(family-name:--font-lm-body) text-sm leading-relaxed text-white/60">
            <motion.p variants={prefersReduced ? undefined : fadeUp}>
              Lumina opened its doors in South Yarra in 2017. Dr. Tremblay and
              Jessica Park had met during their respective training in Sydney
              and recognised a shared philosophy — that the best aesthetic
              results were ones where people looked like themselves, only more
              rested, more confident.
            </motion.p>
            <motion.p variants={prefersReduced ? undefined : fadeUp}>
              They were tired of the approach that treated aesthetics as a
              race toward an idealised standard. They wanted to create a clinic
              that started with the person in front of them, not a trend or
              template.
            </motion.p>
            <motion.p variants={prefersReduced ? undefined : fadeUp}>
              Today, Lumina serves over 3,000 clients from across Melbourne,
              with the majority coming from referrals. We are proud of every
              one of those referrals — they represent the trust that clients
              place in us, and that trust is something we protect every day.
            </motion.p>
          </div>

          {/* CSS interior compositions */}
          <motion.div
            variants={prefersReduced ? undefined : fadeUp}
            className="mt-12 grid gap-4 sm:grid-cols-3"
          >
            {[
              "from-[#e8d0d8] to-[#fdfcfb]",
              "from-[#c9a96e]/30 to-[#e8d0d8]",
              "from-[#9d6e82]/30 to-[#c9a96e]/20",
            ].map((gradient, i) => (
              <div
                key={i}
                className={`aspect-square overflow-hidden rounded-xl bg-linear-to-br ${gradient} border border-[#c9a96e]/20`}
              >
                <div className="flex h-full items-center justify-center">
                  <span className="font-(family-name:--font-lm-body) text-xs uppercase tracking-widest text-white/30">
                    Clinic
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
