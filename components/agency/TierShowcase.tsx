"use client";

import { HoverLift, Reveal, StaggerGroup, StaggerItem } from "@/components/animations";
import TierDetailCard, { type TierDetailData } from "@/components/agency/services/TierDetailCard";
import { SERVICE_TIERS } from "@/lib/services-content";

const tiers: TierDetailData[] = SERVICE_TIERS.map((tier, index) => ({
  name: tier.name,
  badge: tier.badge,
  price: tier.price,
  valueProp: tier.description,
  features: tier.features,
  notIncluded: tier.notIncluded,
  timeline: tier.timeline,
  retainer: tier.retainer,
  previousTier: tier.previousTier ?? (index > 0 ? SERVICE_TIERS[index - 1]?.name : undefined),
  popular: tier.popular,
}));

export default function TierShowcase() {
  return (
    <section
      id="tiers"
      className="flex min-h-screen items-center px-6 py-16 sm:py-20 lg:px-10 lg:py-24 2xl:px-16"
      aria-labelledby="tiers-heading"
    >
      <div className="w-full">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
              Aperix Packages
            </p>

            <h2
              id="tiers-heading"
              className="font-display text-3xl font-bold text-agency-ink sm:text-4xl lg:text-5xl"
            >
              Four ways we can work together.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-agency-muted sm:text-lg">
              Choose the tier that matches your goals: a fast single-page launch, a multi-page lead generator, or a custom build with CMS and integrations.
            </p>
          </Reveal>
        </div>

        <StaggerGroup className="mx-auto mt-10 grid w-full max-w-7xl items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => (
            <StaggerItem key={tier.name} className="flex">
              <HoverLift className="flex h-full w-full" scale={tier.popular ? 1.015 : 1}>
                <TierDetailCard tier={tier} />
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
