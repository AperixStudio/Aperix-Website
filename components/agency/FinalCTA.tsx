"use client";

import Link from "next/link";
import { StaggerGroup, StaggerItem } from "@/components/animations";
import { cn } from "@/lib/utils";
import "./FinalCTA.css";

export default function FinalCTA() {
  return (
    <section
      className="final-cta-section px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      aria-labelledby="final-cta-heading"
    >
      <StaggerGroup className="final-cta-section__panel mx-auto max-w-5xl rounded-[2rem] px-6 py-16 text-center sm:px-8 lg:px-12 lg:py-20">
        <StaggerItem className="final-cta-section__kicker">Next step</StaggerItem>

        <StaggerItem
          id="final-cta-heading"
          className="final-cta-section__heading font-display text-3xl font-bold sm:text-4xl lg:text-5xl"
        >
          Ready to Build?
        </StaggerItem>

        <StaggerItem className="mt-8">
          <Link
            href="/contact"
            className={cn(
              "final-cta-section__button inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold",
              "transition-[filter,transform] duration-150 hover:opacity-100 active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1017]",
            )}
          >
            Enquire Here
          </Link>
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}
