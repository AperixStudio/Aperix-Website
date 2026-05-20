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
        className="agency-panel-wrap mx-auto max-w-5xl px-6 py-16 text-center sm:px-8 lg:px-12 lg:py-20"
      >
        <StaggerItem
          id="final-cta-heading"
          className="font-display text-3xl font-bold text-agency-ink sm:text-4xl lg:text-5xl"
        >
          Ready to Build?
        </StaggerItem>

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
            Enquire Here
          </Link>
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}
