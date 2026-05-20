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
                name="Basic"
                color="muted"
                price="$499"
                className={TIER_CARD_HEIGHT_CLASS}
                valueProp="Get online fast with a single-page site that gives your business a clear, credible presence."
                features={[
                  "Single page - your choosing of what to present",
                  "Fully responsive and mobile friendly",
                  "Contact form with email notification",
                  "Basic on-page SEO (meta tags, page titles, structured data)",
                  "Hosted by Aperix and their chosen providers - transferable to your own hosting any time",
                ]}
                retainer="From $50/month Basic Care"
              />
            </HoverLift>
          </StaggerItem>

          <StaggerItem className="flex">
            <HoverLift className="flex h-full w-full">
              <DeferredTierCard
                name="Growth"
                color="cyan"
                price="$1,290"
                className={TIER_CARD_HEIGHT_CLASS}
                valueProp="A clean multi-page website for businesses that need room to explain their services and build trust."
                features={[
                  "Everything in Basic, PLUS:",
                  "4-5 custom-coded pages with your choice of content",
                  "Google Business Profile setup & optimisation",
                ]}
                retainer="From $100/month Pro Care"
              />
            </HoverLift>
          </StaggerItem>

          <StaggerItem className="flex">
            <HoverLift className="flex h-full w-full" scale={1.015}>
              <DeferredTierCard
                name="Pro"
                color="amber"
                price="$3,290"
                className={TIER_CARD_HEIGHT_CLASS}
                valueProp="A stronger custom site for businesses that need better structure, content control, and enquiry flow."
                features={[
                  "Everything in Growth, PLUS:",
                  "6-10 custom-coded pages",
                  "Content Management System integration - edit your own content",
                  "Google Analytics + Search Console setup",
                  "Performance-focused build with Core Web Vitals in mind",
                  "2 rounds of revisions included",
                ]}
                retainer="From $100/month Pro Care"
                popular
              />
            </HoverLift>
          </StaggerItem>

          <StaggerItem className="flex">
            <HoverLift className="flex h-full w-full">
              <DeferredTierCard
                name="Enterprise"
                color="violet"
                price="$5,999+"
                className={TIER_CARD_HEIGHT_CLASS}
                valueProp="A bespoke build for businesses that need a more considered brand experience and deeper functionality."
                features={[
                  "Everything in Pro, PLUS:",
                  "Unlimited pages, full custom architecture",
                  "Brand identity consultation included",
                  "Advanced animations & interactions",
                  "Headless CMS with full content model",
                  "Custom integrations (booking, payments, portals)",
                  "Advanced SEO strategy + schema markup",
                  "Priority support, 3 months included post-launch",
                ]}
                retainer="From $200/month Enterprise Care"
              />
            </HoverLift>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
