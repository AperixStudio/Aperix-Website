"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   LuminaFAQPage — PRD §9
   Elegant accordion — Cormorant question text, gold + icon.
   ──────────────────────────────────────────────────────────── */

const faqs = [
  {
    q: "Are your practitioners registered with AHPRA?",
    a: "Yes. Dr. Tremblay is registered with AHPRA as a medical practitioner and all our nurses hold current AHPRA nursing registration.",
  },
  {
    q: "What happens at my first consultation?",
    a: "Your first visit is a consultation only. We review your health history, discuss your goals, and explain all treatment options. Nothing is performed at the first appointment without your explicit consent.",
  },
  {
    q: "Are anti-wrinkle injections and dermal fillers safe?",
    a: "When performed by registered practitioners following TGA guidelines and AHPRA standards, these treatments have a strong safety profile. All Schedule 4 substances at Lumina are prescribed and administered under our Medical Director.",
  },
  {
    q: "How long do results last?",
    a: "Anti-wrinkle results typically last 3–4 months. Dermal fillers last 12–18 months depending on product and placement. We'll give you realistic expectations at your consultation.",
  },
  {
    q: "What is your cancellation policy?",
    a: "We require 24 hours notice for cancellations. Late cancellations or no-shows may incur a fee of up to $50.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes, we offer interest-free payment plans through Afterpay and Zip for treatments over $300.",
  },
  {
    q: "What aftercare is required?",
    a: "Aftercare varies by treatment. We provide written aftercare instructions for every treatment. For injectables, avoid strenuous exercise for 24 hours and stay out of direct sun.",
  },
  {
    q: "Is there downtime after treatment?",
    a: "Most treatments have minimal downtime. Anti-wrinkle injections have no downtime. Some skin treatments may cause mild redness for 24–48 hours.",
  },
  {
    q: "What areas do you service?",
    a: "Our clinic is in South Yarra. We do not offer mobile services — all treatments are performed at our clinic.",
  },
  {
    q: "How do I know which treatment is right for me?",
    a: "That's what the consultation is for. We never recommend treatments without understanding your goals and medical history first.",
  },
  {
    q: "Are your products TGA approved?",
    a: "Yes. All injectables and devices used at Lumina are TGA-approved and sourced from authorised Australian distributors.",
  },
  {
    q: "Do you provide before and after photos?",
    a: "We maintain a photo record for clinical purposes but do not use patient photos for marketing without explicit written consent.",
  },
];

export default function LuminaFAQPage() {
  const prefersReduced = useReducedMotion();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <main role="main">
      {/* Hero */}
      <section className="bg-[#1a1118] pb-16 pt-28">
        <div className="mx-auto max-w-4xl px-6">
          <p className="font-(family-name:--font-lm-body) text-xs uppercase tracking-[0.2em] text-[#c9a96e]">
            FAQ
          </p>
          <h1 className="mt-3 font-(family-name:--font-lm-display) text-4xl font-light text-white md:text-5xl">
            Frequently asked questions.
          </h1>
          <p className="mt-3 font-(family-name:--font-lm-body) text-sm text-white/50">
            If you have a question that isn&apos;t answered here, please don&apos;t hesitate to{" "}
            <a href="/demo/premium/book" className="text-[#c9a96e] underline underline-offset-2">
              get in touch
            </a>
            .
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="bg-[#fdfcfb] py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="divide-y divide-[#ede5e9]">
            {faqs.map((faq, idx) => (
              <div key={idx}>
                <button
                  className="flex w-full items-center justify-between py-6 text-left"
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  aria-expanded={openIdx === idx}
                  aria-controls={`faq-${idx}`}
                >
                  <span className="pr-8 font-(family-name:--font-lm-display) text-xl font-light text-[#1a1118]">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openIdx === idx ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-xl font-light text-[#c9a96e]"
                    aria-hidden="true"
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence>
                  {openIdx === idx && (
                    <motion.div
                      id={`faq-${idx}`}
                      initial={prefersReduced ? undefined : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 font-(family-name:--font-lm-body) text-sm leading-relaxed text-[#8b7a83]">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
