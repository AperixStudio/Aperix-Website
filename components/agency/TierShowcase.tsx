"use client";

import { HoverLift, Reveal, StaggerGroup, StaggerItem } from "@/components/animations";
import TierCard from "@/components/agency/TierCard";

export default function TierShowcase() {
  return (
    <section
      id="tiers"
      className="flex min-h-screen items-center px-6 py-14 sm:py-16 lg:px-10 lg:py-20 2xl:px-16"
      aria-labelledby="tiers-heading"
    >
      <div className="w-full">
      {/* ── Section header ──────────────────────────────────── */}
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
            Four Tiers of Work
          </p>

          <h2
            id="tiers-heading"
            className="font-display text-3xl font-bold text-agency-ink sm:text-4xl lg:text-5xl"
          >
            Four ways we can work together.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-agency-muted sm:text-lg">
            From a simple first site through to a custom platform, each tier has a clear fit,
            colour, and scope so you can compare the options quickly.
          </p>
        </Reveal>
      </div>

      {/* ── Cards grid ─────────────────────────────────────── */}
      <StaggerGroup
        className="mx-auto mt-10 grid max-w-450 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        {/* ── Basic ─────────────────────────────────────── */}
        <StaggerItem className="flex">
          <HoverLift className="flex h-full w-full">
            <TierCard
              name="Basic"
              color="muted"
              price="$499"
              valueProp="A clean one-page site for businesses that need a credible online presence without overcomplicating it."
              features={[
                "Single page — hero, services, contact, Google Maps",
                "Mobile-first, fully responsive",
                "Google Business Profile setup",
                "Contact form with email notification",
              ]}
              retainer="From $99/month Basic Care"
              demoHref="/demo/essential"
            />
          </HoverLift>
        </StaggerItem>

        {/* ── Growth ───────────────────────────────────────── */}
        <StaggerItem className="flex">
          <HoverLift className="flex h-full w-full">
            <TierCard
            name="Growth"
            color="cyan"
            price="$1,290"
            valueProp="A small-business website with the core pages in place and enough room to present the business properly."
            features={[
              "4–5 custom-coded pages",
              "Mobile-first, fully responsive design",
              "Google Business Profile setup & optimisation",
              "Contact form with email notification",
              "Basic on-page SEO (meta tags, structured data)",
            ]}
            retainer="From $99/month Basic Care"
            demoHref="/demo/starter"
            />
          </HoverLift>
        </StaggerItem>

        {/* ── Pro (Most Popular) ───────────────────────── */}
        <StaggerItem className="flex">
          <HoverLift className="flex h-full w-full" scale={1.015}>
            <TierCard
            name="Pro"
            color="amber"
            price="$3,290"
            valueProp="A more complete custom site for businesses that need stronger structure, content control, and enquiry flow."
            features={[
              "6–10 custom-coded pages",
              "Custom design system built for your brand",
              "CMS integration (Sanity) — edit your own content",
              "Booking or enquiry flow integration",
              "Full local SEO package",
            ]}
            retainer="From $249/month Standard Care"
            demoHref="/demo/business"
            popular
            />
          </HoverLift>
        </StaggerItem>

        {/* ── Enterprise ───────────────────────────────────────── */}
        <StaggerItem className="flex">
          <HoverLift className="flex h-full w-full">
            <TierCard
            name="Enterprise"
            color="violet"
            price="$5,999+"
            valueProp="A deeper custom build for businesses that need flexibility, stronger brand presentation, and advanced functionality."
            features={[
              "Unlimited pages, full custom architecture",
              "Brand identity consultation included",
              "Advanced animations & interactions (Framer Motion)",
              "Headless CMS with full content model",
              "Custom integrations (booking, payments, portals)",
            ]}
            retainer="From $449/month Growth Care"
            demoHref="/demo/premium"
            />
          </HoverLift>
        </StaggerItem>
      </StaggerGroup>
      </div>
    </section>
  );
}
