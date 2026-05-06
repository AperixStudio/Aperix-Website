"use client";

import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   DemoBanner — PRD §6.1
   Fixed banner at top of every /demo/* route.
   Accepts tierName & businessType to customise the copy.
   ──────────────────────────────────────────────────────────── */

interface DemoBannerProps {
  /** e.g. "Growth" */
  tierName: string;
  /** e.g. "a Melbourne café" — used for fallback text when description is omitted */
  businessType?: string;
  /** Full description override (PRD §6.1 / §7.1 / §8.1 / §9.1) */
  description?: string;
}

export default function DemoBanner({
  tierName,
  businessType,
  description,
}: DemoBannerProps) {
  const text =
    description ??
    `This is a demo site showcasing our ${tierName} tier work. It represents a real project we'd build for ${businessType ?? "a Melbourne business"}.`;

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex flex-col items-center justify-between gap-3 bg-[#1e293b] px-4 py-3 text-white sm:flex-row sm:gap-4 sm:px-6"
      role="banner"
    >
      <p className="text-center text-xs leading-relaxed sm:text-left sm:text-sm">
        <span aria-hidden="true">👋 </span>
        {text}
      </p>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/services"
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10"
        >
          View All Tiers
        </Link>
        <Link
          href="/contact"
          className="rounded-lg bg-[#22d3ee] px-3 py-1.5 text-xs font-semibold text-[#0f172a] transition-colors hover:bg-[#22d3ee]/85"
        >
          Get a Site Like This
        </Link>
      </div>
    </div>
  );
}
