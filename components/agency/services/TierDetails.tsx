"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import TierDetailCard, {
  type TierDetailData,
} from "@/components/agency/services/TierDetailCard";

/* ── tier data ─────────────────────────────────────────── */
const tiers: TierDetailData[] = [
  {
    name: "Basic",
    badge: "muted",
    price: "$499",
    valueProp:
      "Get online fast with a single-page site that gives your business a clear, credible presence.",
    features: [
      "Single page - your choosing of what to present",
      "Fully responsive and mobile friendly",
      "Contact form with email notification",
      "Basic on-page SEO (meta tags, page titles, structured data)",
      "Hosted by Aperix and their chosen providers - transferable to your own hosting any time",
    ],
    notIncluded: [
      "Multi-page navigation",
      "CMS / content editing",
      "Custom design system",
      "Booking or payment integrations",
      "SEO strategy or ongoing optimisation",
    ],
    timeline: "Typically 3-7 Business Days plus time for feedback and revisions",
    retainer: "From $50/month Basic Care",
  },
  {
    name: "Growth",
    badge: "cyan",
    price: "$1,290",
    previousTier: "Basic",
    valueProp:
      "A clean multi-page website for businesses that need room to explain their services and build trust.",
    features: [
      "Everything in Basic, PLUS:",
      "4-5 custom-coded pages with your choice of content",
      "Google Business Profile setup & optimisation",
    ],
    notIncluded: [
      "CMS / content editing panel",
      "Booking or payment integrations",
      "Advanced SEO strategy",
      "Brand identity or logo design",
      "Custom animations beyond standard transitions",
    ],
    timeline: "Typically 2-3 weeks plus time for feedback and revisions",
    retainer: "From $100/month Pro Care",
  },
  {
    name: "Pro",
    badge: "amber",
    price: "$3,290",
    previousTier: "Growth",
    valueProp:
      "A stronger custom site for businesses that need better structure, content control, and enquiry flow.",
    features: [
      "Everything in Growth, PLUS:",
      "6-10 custom-coded pages",
      "Content Management System integration - edit your own content",
      "Google Analytics + Search Console setup",
      "Performance-focused build with Core Web Vitals in mind",
      "2 rounds of revisions included",
    ],
    notIncluded: [
      "Unlimited pages or unlimited revisions",
      "E-commerce / online store",
      "Brand identity or logo design",
      "Custom portals or login areas",
      "Ongoing SEO retainer (available as add-on)",
    ],
    timeline: "Typically 4-6 weeks plus time for feedback and revisions",
    retainer: "From $100/month Pro Care",
    popular: true,
  },
  {
    name: "Enterprise",
    badge: "violet",
    price: "$5,999+",
    previousTier: "Pro",
    valueProp:
      "A bespoke build for businesses that need a more considered brand experience and deeper functionality.",
    features: [
      "Everything in Pro, PLUS:",
      "Unlimited pages, full custom architecture",
      "Brand identity consultation included",
      "Advanced animations & interactions",
      "Headless CMS with full content model",
      "Custom integrations (booking, payments, portals)",
      "Advanced SEO strategy + schema markup",
      "Performance report on delivery",
      "Priority support, 3 months included post-launch",
    ],
    notIncluded: [
      "Ongoing paid advertising management (available as add-on)",
      "Photography or videography production",
      "App development (iOS / Android)",
      "Print design or physical branding materials",
    ],
    timeline: "Scoped individually, typically 6-10 weeks plus time for feedback and revisions ",
    retainer: "From $200/month Enterprise Care",
  },
];

/* ── animation ─────────────────────────────────────────── */
const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── component ─────────────────────────────────────────── */
export default function TierDetails() {
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.05 },
        transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const },
      };

  return (
    <section className="flex min-h-screen items-center py-14 lg:py-20">
      <motion.div
        className="mx-auto w-full max-w-450 px-6 lg:px-10 2xl:px-16"
        variants={stagger}
        {...motionProps}
      >
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
            All Four Tiers
          </p>
          <h2 className="font-display text-3xl font-bold text-agency-ink sm:text-4xl">
            Basic, Growth, Pro, and Enterprise at a glance.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-agency-muted">
            Each option is compact enough to compare on one screen, with the deeper detail handled during quoting.
          </p>
        </div>

        <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => (
            <TierDetailCard key={tier.name} tier={tier} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
