"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import TierDetailCard, {
  type TierDetailData,
} from "@/components/agency/services/TierDetailCard";

/* ── tier data ─────────────────────────────────────────── */
const tiers: TierDetailData[] = [
  {
    name: "Essential",
    badge: "cyan",
    price: "$499",
    valueProp:
      "Get online fast. A single-page site that puts your business on the map — literally.",
    features: [
      "Single page — hero, services, contact, Google Maps",
      "Mobile-first, fully responsive",
      "Google Business Profile setup",
      "Contact form with email notification",
      "Submitted to Google Search Console",
    ],
    notIncluded: [
      "Multi-page navigation",
      "CMS / content editing",
      "Custom design system",
      "Booking or payment integrations",
      "SEO strategy or ongoing optimisation",
    ],
    timeline: "1–2 weeks from sign-off",
    idealFor:
      "Sole traders, tradespeople, or new businesses that need a professional presence fast without a large upfront investment.",
    retainer: "From $89/month Basic Care",
    demoLink: "/demo/essential",
  },
  {
    name: "Starter",
    badge: "cyan",
    price: "$999",
    valueProp:
      "A clean, fast, professional web presence for businesses ready to be found on Google.",
    features: [
      "4–5 custom-coded pages",
      "Mobile-first, fully responsive design",
      "Google Business Profile setup & optimisation",
      "Contact form with email notification",
      "Basic on-page SEO (meta tags, structured data)",
      "Cloudflare hosting setup",
    ],
    notIncluded: [
      "CMS / content editing panel",
      "Booking or payment integrations",
      "Advanced SEO strategy",
      "Brand identity or logo design",
      "Custom animations beyond standard transitions",
    ],
    timeline: "2–3 weeks from sign-off",
    idealFor:
      "Cafés, salons, local services, and small businesses that need a polished multi-page site and local SEO presence.",
    retainer: "From $89/month Basic Care",
    demoLink: "/demo/starter",
  },
  {
    name: "Business",
    badge: "amber",
    price: "$1,799",
    valueProp:
      "A conversion-focused site with everything a growing Melbourne business needs to win customers from Google.",
    features: [
      "6–10 custom-coded pages",
      "Custom design system built for your brand",
      "CMS integration (Sanity) — edit your own content",
      "Booking or enquiry flow integration",
      "Full local SEO package",
      "Google Analytics + Search Console setup",
      "Core Web Vitals optimised (Lighthouse 100/100)",
      "2 rounds of revisions included",
    ],
    notIncluded: [
      "Unlimited pages or unlimited revisions",
      "E-commerce / online store",
      "Brand identity or logo design",
      "Custom portals or login areas",
      "Ongoing SEO retainer (available as add-on)",
    ],
    timeline: "3–5 weeks from design sign-off",
    idealFor:
      "Established businesses, multi-location services, or trades companies ready to invest in growth and dominate local search results.",
    retainer: "From $179/month Standard Care",
    demoLink: "/demo/business",
    popular: true,
  },
  {
    name: "Premium",
    badge: "violet",
    price: "$3,999+",
    valueProp:
      "A bespoke, high-performance build that positions your business as the market leader in your category.",
    features: [
      "Unlimited pages, full custom architecture",
      "Brand identity consultation included",
      "Advanced animations & interactions (Framer Motion)",
      "Headless CMS with full content model",
      "Custom integrations (booking, payments, portals)",
      "Advanced SEO strategy + schema markup",
      "Performance report on delivery (Lighthouse 100/100 guaranteed)",
      "Priority support, 3 months included post-launch",
    ],
    notIncluded: [
      "Ongoing paid advertising management (available as add-on)",
      "Photography or videography production",
      "App development (iOS / Android)",
      "Print design or physical branding materials",
    ],
    timeline: "6–10 weeks from design sign-off (scoped individually)",
    idealFor:
      "Premium service providers, med spas, architects, and brands that need a website as polished as their service.",
    retainer: "From $349/month Growth Care",
    demoLink: "/demo/premium",
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
    <section className="bg-agency-bg py-20 lg:py-28">
      <motion.div
        className="mx-auto max-w-7xl px-6"
        variants={stagger}
        {...motionProps}
      >
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => (
            <TierDetailCard key={tier.name} tier={tier} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
