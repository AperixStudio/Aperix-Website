"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/animations";
import { cn } from "@/lib/utils";

const LIVE_SITES = [
  {
    name: "The Hidden Chapter",
    href: "https://thehiddenchapter.com.au/",
    location: "Victoria, Australia",
    status: "Live now",
    label: "E-commerce / brand experience",
    summary:
      "A blind date with a book storefront built around mood, mystery, and gifting. The site leads with a strong brand concept, clear shopping flow, and a polished experience that feels thoughtful from the first scroll.",
    scope: ["E-commerce", "Brand storytelling", "Responsive UX", "Story-led homepage", "Warm branded shopping flow"],
  },
  {
    name: "Rhino's Walk",
    href: "https://admirable-axolotl-39bf5e.netlify.app/",
    location: "Melbourne, VIC",
    status: "Live now",
    label: "Fundraiser / community campaign",
    summary:
      "A campaign site for a 24-hour community walk supporting the Good Friday Appeal. Designed to explain the cause quickly, highlight impact, and make it easy for supporters to donate or join the walk.",
    scope: ["Campaign site", "Donation CTA", "Community storytelling", "Impact-driven design"],
  },
  {
    name: "POV Sync",
    href: "https://pov-sync.onrender.com/",
    location: "Web app",
    status: "Live now",
    label: "SaaS / streaming product",
    preview: "/POVSyncPreview.png",
    summary:
      "A multi-POV streaming tool that brings YouTube and Twitch feeds into one synced view. The product site focuses on fast onboarding, clear feature communication, and a simple path into the host setup flow.",
    scope: ["SaaS landing", "Product messaging", "Onboarding UX", "Fast setup flow"],
  },
  {
    name: "Complete Trade Solutions",
    href: "https://completetradesolutions.netlify.app/",
    location: "Melbourne, VIC",
    status: "Live now",
    label: "Trades / home renovation",
    summary:
      "A full-service trades business covering kitchen renovations, roof restoration, painting, plumbing, electrical, cabinetry, and flooring. The site leads with a cinematic intro animation, clear service breakdown, and a direct quote enquiry flow.",
    scope: ["Multi-service trades", "Intro animation", "Service showcase", "Quote CTA", "Mobile-first"],
  },
  {
    name: "National Roofing Solutions",
    href: "https://nationalroofingsolutions.netlify.app/",
    location: "Sunbury, VIC",
    status: "Live now",
    label: "Roofing contractor",
    summary:
      "A roofing contractor site for a Sunbury-based business servicing Melbourne's north-west. Built around a bold hero with a typewriter service loop, trust signals, and a focused contact flow for roof repairs, restorations, and replacements.",
    scope: ["Local trades", "Typewriter hero", "Service pages", "Trust signals", "Local SEO foundations"],
  },
] as const;

type Site = (typeof LIVE_SITES)[number];

const CARD_THEMES = [
  {
    // The Hidden Chapter — leaf green
    gradient: "from-[#3a7d44] to-[#2d6235]",
    accentLight: "text-white/70",
    accent: "text-[#6dba7d]",
    badgeBg: "bg-white/20 text-white border-white/30",
    tagBg: "border-[#3a7d44]/20 bg-[#3a7d44]/10 text-agency-ink",
    btn: "bg-[#3a7d44] text-white hover:bg-[#2d6235]",
    darkGradient: "from-[#0d1f10] to-[#08140b]",
  },
  {
    // Rhino's Walk — light purple
    gradient: "from-[#7e5bbd] to-[#6642a8]",
    accentLight: "text-white/70",
    accent: "text-[#c4aef0]",
    badgeBg: "bg-white/20 text-white border-white/30",
    tagBg: "border-[#7e5bbd]/20 bg-[#7e5bbd]/10 text-agency-ink",
    btn: "bg-[#7e5bbd] text-white hover:bg-[#6642a8]",
    darkGradient: "from-[#1a1028] to-[#110a1e]",
  },
  {
    // POV Sync — Twitch purple
    gradient: "from-[#9146ff] to-[#772ce8]",
    accentLight: "text-white/70",
    accent: "text-[#c89bff]",
    badgeBg: "bg-white/20 text-white border-white/30",
    tagBg: "border-[#9146ff]/20 bg-[#9146ff]/10 text-agency-ink",
    btn: "bg-[#9146ff] text-white hover:bg-[#772ce8]",
    darkGradient: "from-[#1a0d35] to-[#110826]",
  },
  {
    // Complete Trade Solutions — CTS orange
    gradient: "from-[#e85d04] to-[#c44d03]",
    accentLight: "text-white/70",
    accent: "text-[#ffaa6b]",
    badgeBg: "bg-white/20 text-white border-white/30",
    tagBg: "border-[#e85d04]/20 bg-[#e85d04]/10 text-agency-ink",
    btn: "bg-[#e85d04] text-white hover:bg-[#c44d03]",
    darkGradient: "from-[#1e0e00] to-[#160900]",
  },
  {
    // National Roofing Solutions — storm blue
    gradient: "from-[#2e5f8a] to-[#1e4a70]",
    accentLight: "text-white/70",
    accent: "text-[#7eb8e8]",
    badgeBg: "bg-white/20 text-white border-white/30",
    tagBg: "border-[#2e5f8a]/20 bg-[#2e5f8a]/10 text-agency-ink",
    btn: "bg-[#2e5f8a] text-white hover:bg-[#1e4a70]",
    darkGradient: "from-[#0a1826] to-[#06101a]",
  },
] as const;

const TOTAL = LIVE_SITES.length;
const STEP_DEG = 18;
const DRAG_THRESHOLD = 60;

function getOffset(index: number, active: number): number {
  let offset = (index - active + TOTAL) % TOTAL;
  if (offset > TOTAL / 2) offset -= TOTAL;
  return offset;
}

function ProjectCard({
  site,
  theme,
  offset,
  isActive,
  onClick,
}: {
  site: Site;
  theme: (typeof CARD_THEMES)[number];
  offset: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const rotate = offset * STEP_DEG;
  const zIndex = TOTAL - Math.abs(offset);
  const absOffset = Math.abs(offset);

  return (
    <motion.div
      onClick={!isActive ? onClick : undefined}
      animate={{
        rotate,
        scale: isActive ? 1 : 0.96 - absOffset * 0.015,
        opacity: absOffset > 2 ? 0 : 1,
        x: offset * 14,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 30, mass: 1.2 }}
      style={{
        zIndex,
        position: "absolute",
        top: 0,
        left: "50%",
        marginLeft: "-170px",
        transformOrigin: "50% 110%",
        cursor: isActive ? "default" : "pointer",
        width: 340,
      }}
      aria-hidden={!isActive}
    >
      <div className="flex h-120 w-full flex-col overflow-hidden rounded-3xl border border-agency-border bg-agency-surface shadow-[0_20px_60px_rgba(0,0,0,0.10)]">
        <div
          className={`relative flex flex-1 flex-col p-7 bg-linear-to-br dark:hidden ${theme.gradient}`}
        >
          <span
            className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${theme.badgeBg}`}
          >
            {site.status}
          </span>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-agency-muted">
            {site.location}
          </p>
          <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-white">
            {site.name}
          </h3>
          <p className={`mt-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${theme.accent}`}>
            {site.label}
          </p>
        </div>
        <div
          className={`relative hidden flex-col p-7 bg-linear-to-br dark:flex flex-1 ${theme.darkGradient}`}
        >
          <span
            className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${theme.badgeBg}`}
          >
            {site.status}
          </span>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-agency-muted">
            {site.location}
          </p>
          <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-white">
            {site.name}
          </h3>
          <p className={`mt-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${theme.accent}`}>
            {site.label}
          </p>
        </div>
        {/* Live preview */}
        <div className="relative h-44 w-full overflow-hidden border-t border-agency-border bg-agency-bg">
          {"preview" in site && site.preview ? (
            <img
              src={site.preview}
              alt={`Preview of ${site.name}`}
              className="absolute inset-0 h-full w-full object-cover object-top"
              loading="lazy"
              aria-hidden="true"
            />
          ) : (
            <iframe
              src={site.href}
              title={`Preview of ${site.name}`}
              className="pointer-events-none absolute left-0 top-0 h-225 w-360 origin-top-left select-none"
              style={{ transform: "scale(0.235)", transformOrigin: "top left" }}
              loading="lazy"
              tabIndex={-1}
              aria-hidden="true"
              sandbox="allow-scripts allow-same-origin"
            />
          )}
          {/* Overlay to block interaction */}
          <div className="absolute inset-0" />
        </div>

        {/* Visit button */}
        <div className="border-t border-agency-border bg-agency-surface px-6 py-4">
          {site.href ? (
            <Link
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isActive ? 0 : -1}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${theme.btn}`}
              onClick={(e) => e.stopPropagation()}
            >
              Visit live site <span aria-hidden="true">↗</span>
            </Link>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

export default function LiveSitesSection() {
  const [active, setActive] = useState(0);
  const dragStartX = useRef(0);

  const goTo = useCallback((index: number) => {
    setActive(((index % TOTAL) + TOTAL) % TOTAL);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const delta = e.clientX - dragStartX.current;
      if (delta < -DRAG_THRESHOLD) goTo(active + 1);
      else if (delta > DRAG_THRESHOLD) goTo(active - 1);
    },
    [active, goTo],
  );

  return (
    <section
      id="live-sites"
      className="overflow-x-hidden px-6 py-20 lg:px-12 lg:py-32"
      aria-labelledby="live-sites-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
              Recent Launches
            </p>
            <h2
              id="live-sites-heading"
              className="font-display text-3xl font-bold leading-tight text-agency-ink sm:text-4xl lg:text-5xl"
            >
              Real launches. Real results.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-agency-muted sm:text-lg">
              A few of the projects we have shipped — each one built for a real business with a real brief.
            </p>
          </Reveal>
          <Reveal>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Select project">
              {LIVE_SITES.map((site, i) => (
                <button
                  key={site.name}
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => goTo(i)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200",
                    active === i
                      ? "border-agency-ink bg-agency-ink text-white shadow-sm"
                      : "border-agency-border bg-agency-surface text-agency-muted hover:border-agency-ink/40 hover:text-agency-ink",
                  )}
                >
                  {site.name}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 flex justify-center">
          <div
            className="relative select-none"
            style={{ height: 520, width: "min(100%, 420px)", touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            {LIVE_SITES.map((site, i) => {
              const offset = getOffset(i, active);
              return (
                <ProjectCard
                  key={site.name}
                  site={site}
                  theme={CARD_THEMES[i % CARD_THEMES.length]}
                  offset={offset}
                  isActive={i === active}
                  onClick={() => goTo(i)}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
          {LIVE_SITES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                active === i ? "w-6 bg-agency-ink" : "w-1.5 bg-agency-border",
              )}
            />
          ))}
        </div>


      </div>
    </section>
  );
}
