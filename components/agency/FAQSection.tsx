"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
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
      "Starter sites typically take 2–3 weeks. Business tier sites take 3–5 weeks. Premium builds are scoped individually but typically 6–10 weeks from design sign-off.",
  },
  {
    question: "What do I need to provide?",
    answer:
      "Your logo (or we recommend a designer), your brand colours if you have them, any photos of your business, and the key information about your services. We handle the rest.",
  },
  {
    question: "What’s included in the monthly retainer?",
    answer:
      "Hosting on fast, secure infrastructure, monthly dependency updates, uptime monitoring, SSL management, one monthly analytics report, and 1–2 hours of content updates per month. No surprises.",
  },
  {
    question: "Do you do WordPress?",
    answer:
      "We don’t. All our sites are custom-coded in Next.js, which consistently outperforms WordPress on speed, security, and SEO. If you need a simple content management interface, we use Sanity CMS — a modern, purpose-built tool that’s faster and safer than WordPress.",
  },
  {
    question: "I’m in [suburb], can we meet in person?",
    answer:
      "Yes. I’m Melbourne-based and happy to meet in person if that suits you. Most ongoing work happens remotely, but a face-to-face introduction is always an option.",
  },
];

export default function FAQSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="px-6 py-20 lg:px-12 lg:py-32"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        {/* ── Section header ────────────────────────────────── */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={
            prefersReduced ? undefined : { duration: 0.4, ease: "easeOut" }
          }
          className="text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
            Frequently Asked Questions
          </p>
          <h2
            id="faq-heading"
            className="font-display text-3xl font-bold text-agency-ink sm:text-4xl"
          >
            Got questions? We&rsquo;ve got answers.
          </h2>
        </motion.div>

        {/* ── Accordion ─────────────────────────────────────── */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={
            prefersReduced
              ? undefined
              : { duration: 0.4, ease: "easeOut", delay: 0.1 }
          }
          className="mt-12"
        >
          <Accordion>
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
