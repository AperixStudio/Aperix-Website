"use client";

import { Reveal } from "@/components/animations";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { FAQ_ITEMS } from "@/lib/services-content";

/* ────────────────────────────────────────────────────────────
   FAQSection — PRD §4.2.7
   Six questions & answers rendered with the Accordion
   compound component. Smooth Framer Motion height animation
   is handled inside Accordion itself.
   ──────────────────────────────────────────────────────────── */

export default function FAQSection() {
  return (
    <section
      className="px-6 py-20 lg:px-12 lg:py-32"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        {/* ── Section header ────────────────────────────────── */}
        <Reveal className="text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
            Frequently Asked Questions
          </p>
          <h2
            id="faq-heading"
            className="font-display text-3xl font-bold text-agency-ink sm:text-4xl"
          >
            Questions we get asked a lot.
          </h2>
        </Reveal>

        {/* ── Accordion ─────────────────────────────────────── */}
        <Reveal className="mt-12">
          <Accordion>
            {FAQ_ITEMS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
