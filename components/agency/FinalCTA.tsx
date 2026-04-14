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
        className="agency-panel-dark-wrap mx-auto max-w-5xl px-6 py-20 text-center sm:px-8 lg:px-12 lg:py-24"
      >
        {/* H2 */}
        <StaggerItem
          id="final-cta-heading"
          className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
        >
          If the website no longer feels right, let&rsquo;s sort it out.
        </StaggerItem>

        {/* Subtext */}
        <StaggerItem
          className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg"
        >
          Send us a message, tell us what&rsquo;s going on, and we&rsquo;ll come back to you
          with honest advice on the next step. Email is absolutely fine.
        </StaggerItem>

        {/* CTA button */}
        <StaggerItem className="mt-8">
          <Link
            href="/contact"
            className={cn(
              "inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold",
              "bg-white text-agency-ink",
              "transition-opacity duration-150 hover:opacity-85 active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-agency-ink",
            )}
          >
            Get in Contact
          </Link>
        </StaggerItem>

        {/* Location line */}
        <StaggerItem
          className="mt-6 text-sm text-white/50"
        >
          Based in Melbourne · Serving all of Victoria
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}
