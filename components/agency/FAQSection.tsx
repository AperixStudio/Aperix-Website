"use client";

import { Reveal } from "@/components/animations";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";

/* ────────────────────────────────────────────────────────────
   FAQSection — PRD §4.2.7
   Six questions & answers rendered with the Accordion
   compound component. Smooth Framer Motion height animation
   is handled inside Accordion itself.
   ──────────────────────────────────────────────────────────── */

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: "Do I own my website after you build it?",
    answer:
      "Yes, completely. You own the code, the design, and the domain. We manage hosting on your behalf as part of the retainer, but everything is yours. If you ever want to take it elsewhere, we hand over the full repository.",
  },
  {
    question: "How long does a build take?",
    answer:
      "Basic sites are usually the quickest at around 3–7 business days once content is ready. Growth sites typically take 2–3 weeks, Pro sites usually land around 4–6 weeks, and Enterprise builds are scoped individually but often run 6–10 weeks depending on complexity.",
  },
  {
    question: "What do I need to provide?",
    answer:
      "Usually your logo, any brand colours or references you already have, photos if you’ve got them, and the key details about your services. We handle the structure, design, and build from there.",
  },
  {
    question: "What’s included in the monthly retainer?",
    answer:
      "The care plans cover hosting, security updates, uptime monitoring, SSL management, and general maintenance. Basic and Growth usually suit lighter support needs, while Pro and Enterprise can include content changes, reporting, faster support, and more hands-on help.",
  },
  {
    question: "Do you do WordPress?",
    answer:
      "Not for this kind of work. We build these sites custom in Next.js because it gives us more control over speed, structure, and long-term maintenance. If you need an easy way to edit content, we usually pair it with Sanity CMS.",
  },
  {
    question: "I’m in [suburb], can we meet in person?",
    answer:
      "Yes. We’re Melbourne-based and happy to meet in person if that’s easier. Most of the work happens remotely, but a face-to-face first meeting is always an option.",
  },
];

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
            {FAQS.map((faq, i) => (
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
