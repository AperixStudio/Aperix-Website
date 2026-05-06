"use client";

import Link from "next/link";
import { StaggerGroup, StaggerItem } from "@/components/animations";
import { cn } from "@/lib/utils";

export default function FinalCTA() {
  return (
    <section
      className="px-4 py-4 sm:px-6 lg:px-8"
      aria-labelledby="final-cta-heading"
    >
      <StaggerGroup
        className="agency-panel-wrap mx-auto max-w-5xl px-6 py-20 text-center sm:px-8 lg:px-12 lg:py-24"
      >
        {/* H2 */}
        <StaggerItem
          id="final-cta-heading"
          className="font-display text-3xl font-bold text-agency-ink sm:text-4xl lg:text-5xl"
        >
          Ready to build a website that actually brings enquiries?
        </StaggerItem>

        {/* Subtext */}
        <StaggerItem
          className="mt-5 text-base leading-relaxed text-agency-muted sm:text-lg"
        >
          Tell us what you need and we&rsquo;ll recommend the right tier, timeline,
          and next step — no pressure, no template lock-in.
        </StaggerItem>

        {/* CTA button */}
        <StaggerItem className="mt-8">
          <Link
            href="/contact"
            className={cn(
              "inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold",
              "agency-button-primary",
              "transition-opacity duration-150 hover:opacity-85 active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agency-accent focus-visible:ring-offset-2 focus-visible:ring-offset-agency-surface",
            )}
          >
            Start your project
          </Link>
        </StaggerItem>

        {/* Location line */}
        <StaggerItem
          className="mt-6 text-sm text-agency-muted"
        >
          Melbourne-built · Custom-coded · Reply within 24 hours
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}
