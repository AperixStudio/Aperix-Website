"use client";

import { useEffect, useRef, useState } from "react";
import { HoverLift, Reveal, Shimmer, StaggerGroup, StaggerItem } from "@/components/animations";
import type { TierCardProps } from "@/components/agency/TierCard";
import { cn } from "@/lib/utils";

const TIER_CARD_HEIGHT_CLASS = "md:h-[40rem]";
const demoShimmerDuration = 1;

function TierCardSkeleton({
  featureCount,
  popular = false,
  className,
}: {
  featureCount: number;
  popular?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative flex flex-col rounded-2xl border border-agency-border bg-agency-surface p-8 shadow-[0_18px_50px_rgba(67,92,122,0.08)]", className)}>
      {popular ? (
        <Shimmer duration={demoShimmerDuration} className="absolute -top-3.5 left-1/2 h-6 w-28 -translate-x-1/2 rounded-full" />
      ) : null}
      <Shimmer duration={demoShimmerDuration} className="mb-5 h-5 w-128 rounded-8" />
      <Shimmer duration={demoShimmerDuration} className="mb-2 h-10 w-44 rounded-md" />
      <Shimmer duration={demoShimmerDuration} className="mb-6 h-3.5 w-24 rounded-sm" />
      <Shimmer duration={demoShimmerDuration} className="mb-3 h-3.5 w-full" />
      <Shimmer duration={demoShimmerDuration} className="mb-3 h-3.5 w-full" />
      <div className="my-6 border-t border-agency-border" />
      <ul className="flex flex-1 flex-col gap-3">
        {Array.from({ length: featureCount }).map((_, index) => (
          <li key={index} className="flex items-center gap-2.5">
            <Shimmer duration={demoShimmerDuration} className="h-3.5 w-[60%]" />
          </li>
        ))}
      </ul>
      <Shimmer duration={demoShimmerDuration} className="mt-6 h-3.5 w-40" />
      <Shimmer duration={demoShimmerDuration} className="mt-6 h-11 w-full rounded-lg" />
    </div>
  );
}

function DeferredTierCard(props: TierCardProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [LoadedTierCard, setLoadedTierCard] = useState<null | React.ComponentType<TierCardProps>>(null);

  useEffect(() => {
    if (LoadedTierCard) return;
    const node = hostRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        // Load the real tier card only after the skeleton has been shown briefly.
        window.setTimeout(() => {
          import("@/components/agency/TierCard").then((mod) => {
            setLoadedTierCard(() => mod.default);
          });
        }, 350);
        observer.disconnect();
      },
      { rootMargin: "0px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [LoadedTierCard]);

  return (
    <div ref={hostRef}>
      {LoadedTierCard ? (
        <LoadedTierCard {...props} />
      ) : (
        <TierCardSkeleton
          featureCount={props.features.length}
          popular={props.popular}
          className={props.className}
        />
      )}
    </div>
  );
}

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
            <DeferredTierCard
              name="Essential"
              color="cyan"
              price="$499"
              className={TIER_CARD_HEIGHT_CLASS}
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
            <DeferredTierCard
            name="Starter"
            color="cyan"
            price="$1,290"
            className={TIER_CARD_HEIGHT_CLASS}
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
            <DeferredTierCard
            name="Business"
            color="amber"
            price="$3,290"
            className={TIER_CARD_HEIGHT_CLASS}
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
            <DeferredTierCard
            name="Premium"
            color="violet"
            price="$5,999+"
            className={TIER_CARD_HEIGHT_CLASS}
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
