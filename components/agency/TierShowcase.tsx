"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
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
    <div
      className={cn(
        "relative flex h-full w-full flex-col rounded-2xl border border-agency-border bg-agency-surface p-8 shadow-[0_18px_50px_rgba(67,92,122,0.08)]",
        className,
      )}
    >
      {popular ? (
        <Shimmer duration={demoShimmerDuration} className="absolute -top-3.5 left-1/2 h-6 w-28 -translate-x-1/2 rounded-full" />
      ) : null}
      <Shimmer duration={demoShimmerDuration} className="mb-5 h-5 w-28 rounded-full" />
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
  const [LoadedTierCard, setLoadedTierCard] = useState<ComponentType<TierCardProps> | null>(null);

  useEffect(() => {
    if (LoadedTierCard) return;

    const node = hostRef.current;
    if (!node) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        timeoutId = setTimeout(() => {
          import("@/components/agency/TierCard").then((mod) => {
            setLoadedTierCard(() => mod.default);
          });
        }, 350);

        observer.disconnect();
      },
      { rootMargin: "0px 0px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [LoadedTierCard]);

  return (
    <div ref={hostRef} className="flex h-full w-full">
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
      className="flex min-h-screen items-center px-6 py-14 sm:py-16 lg:px-10 lg:py-20 2xl:px-16"
      aria-labelledby="tiers-heading"
    >
      <div className="w-full">
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

        <StaggerGroup className="mx-auto mt-10 grid max-w-450 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StaggerItem className="flex">
            <HoverLift className="flex h-full w-full">
              <DeferredTierCard
                name="Essential"
                color="muted"
                price="$499"
                className={TIER_CARD_HEIGHT_CLASS}
                valueProp="A simple one-page site for businesses that need a clean, credible online presence without overcomplicating it."
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

          <StaggerItem className="flex">
            <HoverLift className="flex h-full w-full">
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
                ]}
                retainer="From $99/month Basic Care"
                demoHref="/demo/starter"
              />
            </HoverLift>
          </StaggerItem>

          <StaggerItem className="flex">
            <HoverLift className="flex h-full w-full" scale={1.015}>
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
                ]}
                retainer="From $249/month Standard Care"
                demoHref="/demo/business"
                popular
              />
            </HoverLift>
          </StaggerItem>

          <StaggerItem className="flex">
            <HoverLift className="flex h-full w-full">
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
