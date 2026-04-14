"use client";

import { HoverLift, Reveal, StaggerGroup, StaggerItem } from "@/components/animations";
import TierCard from "@/components/agency/TierCard";

export default function TierShowcase() {
  return (
    <section
      id="tiers"
      className="px-6 py-20 lg:px-12 lg:py-32"
      aria-labelledby="tiers-heading"
    >
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
            Some businesses need a clean one-page site. Others need a full custom build.
            These tiers give you a realistic idea of what we offer and where each option fits.
          </p>
        </Reveal>
      </div>

      {/* ── Cards grid (2×2 on desktop) ─────────────────────── */}
      <StaggerGroup
        className="mx-auto mt-14 grid max-w-7xl gap-8 md:grid-cols-2 lg:mt-20 lg:grid-cols-2"
      >
        {/* ── Essential ─────────────────────────────────────── */}
        <StaggerItem>
          <HoverLift>
            <TierCard
              name="Essential"
              color="cyan"
              price="$499"
              valueProp="A simple one-page site for businesses that need a clean, credible online presence without overcomplicating it."
              features={[
                "Single page — hero, services, contact, Google Maps",
                "Mobile-first, fully responsive",
                "Google Business Profile setup",
                "Contact form with email notification",
                "Search Console setup on launch",
              ]}
              retainer="From $99/month Basic Care"
              demoHref="/demo/essential"
            />
          </HoverLift>
        </StaggerItem>

        {/* ── Starter ───────────────────────────────────────── */}
        <StaggerItem>
          <HoverLift>
            <TierCard
            name="Starter"
            color="cyan"
            price="$1,290"
            valueProp="A solid small-business website with the core pages in place and enough room to present the business properly."
            features={[
              "4–5 custom-coded pages",
              "Mobile-first, fully responsive design",
              "Google Business Profile setup & optimisation",
              "Contact form with email notification",
              "Basic on-page SEO (meta tags, structured data)",
              "Cloudflare hosting setup",
            ]}
            retainer="From $99/month Basic Care"
            demoHref="/demo/starter"
            />
          </HoverLift>
        </StaggerItem>

        {/* ── Business (Most Popular) ───────────────────────── */}
        <StaggerItem>
          <HoverLift scale={1.015}>
            <TierCard
            name="Business"
            color="amber"
            price="$3,290"
            valueProp="A more complete custom site for businesses that need stronger structure, better content control, and a clearer enquiry flow."
            features={[
              "6–10 custom-coded pages",
              "Custom design system built for your brand",
              "CMS integration (Sanity) — edit your own content",
              "Booking or enquiry flow integration",
              "Full local SEO package",
              "Google Analytics + Search Console setup",
              "Performance-focused build with Core Web Vitals in mind",
              "2 rounds of revisions included",
            ]}
            retainer="From $249/month Standard Care"
            demoHref="/demo/business"
            popular
            />
          </HoverLift>
        </StaggerItem>

        {/* ── Premium ───────────────────────────────────────── */}
        <StaggerItem>
          <HoverLift>
            <TierCard
            name="Premium"
            color="violet"
            price="$5,999+"
            valueProp="A deeper custom build for businesses that need more flexibility, stronger brand presentation, and more involved functionality."
            features={[
              "Unlimited pages, full custom architecture",
              "Brand identity consultation included",
              "Advanced animations & interactions (Framer Motion)",
              "Headless CMS with full content model",
              "Custom integrations (booking, payments, portals)",
              "Advanced SEO strategy + schema markup",
              "Performance report on delivery",
              "Priority support, 3 months included post-launch",
            ]}
            retainer="From $449/month Growth Care"
            demoHref="/demo/premium"
            />
          </HoverLift>
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}
