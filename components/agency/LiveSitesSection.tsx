"use client";

import { useState, useCallback, useRef, useEffect, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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
    client: "The Hidden Chapter",
    problem:
      "The business needed an online store that felt like a curated gift experience instead of a generic product catalogue.",
    solution:
      "We built a mood-led storefront with stronger visual hierarchy, clearer product pathways, and brand storytelling that supports discovery on desktop and mobile.",
    result:
      "The finished site gives the brand a more premium feel and makes it easier for visitors to move from curiosity to browsing and purchase.",
    beforeAfter:
      "Before: the concept risked feeling like a standard shop. After: the experience feels curated, giftable, and more memorable.",
    relatedService: "Growth / Pro-level ecommerce and brand storytelling",
    impact:
      "Business impact: stronger first impression, simpler shopping flow, and a clearer reason to buy without needing extra explanation.",
    proofLibrary: [
      { label: "Launch note", text: "Built to make the first scroll carry the brand mood immediately." },
      { label: "Process note", text: "The product flow was kept short so mobile visitors could browse quickly." },
      { label: "Visual proof", text: "Strong hero imagery and calmer product presentation create the premium feel." },
    ],
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
    client: "Rhino's Walk",
    problem:
      "The campaign needed a page that could communicate the cause fast and turn that attention into donations and participation.",
    solution:
      "We shaped the page around the fundraiser story, clear support actions, and a layout that keeps the donation path obvious on small screens.",
    result:
      "Visitors can understand the cause quickly and move directly into donating or joining the walk without digging through extra content.",
    beforeAfter:
      "Before: the campaign would have needed more explanation to build momentum. After: the page presents the cause, impact, and next step in one flow.",
    relatedService: "Growth package for campaign-style websites",
    impact:
      "Business impact: stronger event clarity, faster decision-making, and a cleaner route to donations and sign-ups.",
    proofLibrary: [
      { label: "Launch note", text: "Built to explain the fundraiser in a single pass." },
      { label: "Process note", text: "The CTA path was kept direct so supporters could act immediately." },
      { label: "Proof point", text: "Community-first copy and impact framing support trust fast." },
    ],
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
    client: "POV Sync",
    problem:
      "The product needed to explain a fairly technical workflow without losing people before they reached the setup stage.",
    solution:
      "We focused the page on fast onboarding, clear feature explanation, and a clean route into the host setup flow.",
    result:
      "The landing experience makes the product easier to understand quickly, which supports sign-up intent and reduces confusion for new users.",
    beforeAfter:
      "Before: the value proposition could have felt complex. After: the product story is clearer and the setup path is easier to follow.",
    relatedService: "Pro-level SaaS landing page and onboarding UX",
    impact:
      "Business impact: simpler explanation of the product, less friction in the setup journey, and stronger clarity around the core feature set.",
    proofLibrary: [
      { label: "Launch note", text: "Preview of the synced feed workflow is used to sell the idea quickly." },
      { label: "Process note", text: "The content hierarchy is built to answer 'what is this?' before 'how do I use it?'" },
      { label: "Visual proof", text: "The preview image shows the product in context, not just as a feature list." },
    ],
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
    client: "Complete Trade Solutions",
    problem:
      "The business needed one site that could handle multiple services without feeling crowded or hard to scan.",
    solution:
      "We used a cinematic intro, service grouping, and a quote-first structure so visitors can quickly find the service they need.",
    result:
      "The site presents the business as broader and more organised, with a clearer path into enquiries across multiple trades.",
    beforeAfter:
      "Before: a multi-service business could easily feel scattered. After: the site reads as one capable team with a clean quote path.",
    relatedService: "Pro package for multi-service trades businesses",
    impact:
      "Business impact: better service clarity, stronger quote intent, and a homepage that supports more than one line of work.",
    proofLibrary: [
      { label: "Launch note", text: "The intro animation sets up the business before the service list starts." },
      { label: "Process note", text: "Services are grouped so the page stays scannable even with broad offerings." },
      { label: "Proof point", text: "The quote CTA is always visible enough to keep the enquiry path obvious." },
    ],
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
    client: "National Roofing Solutions",
    problem:
      "The site needed to make local roofing services feel trustworthy and easy to contact from the first screen.",
    solution:
      "We used a bold hero, strong trust signals, and a local-service structure that keeps repairs, restorations, and replacements easy to understand.",
    result:
      "The business now has a focused local presence that makes the core services clearer and the contact path more direct.",
    beforeAfter:
      "Before: the roofing offer could have felt broad and hard to scan. After: the site leads with trust, clarity, and local service intent.",
    relatedService: "Growth package with local SEO foundations",
    impact:
      "Business impact: better local credibility, faster service comprehension, and a contact path suited to urgent roofing enquiries.",
    proofLibrary: [
      { label: "Launch note", text: "The typewriter hero reinforces the service set without adding clutter." },
      { label: "Process note", text: "Trust signals were front-loaded to help first-time visitors feel confident." },
      { label: "Visual proof", text: "The service layout supports quick scanning on mobile." },
    ],
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

function CaseStudyModal({
  site,
  onClose,
}: {
  site: Site;
  onClose: () => void;
}) {
  const siteIndex = LIVE_SITES.findIndex((item) => item.name === site.name);
  const theme = CARD_THEMES[siteIndex >= 0 ? siteIndex % CARD_THEMES.length : 0];

  return (
    <motion.div
      className="fixed inset-0 z-100 flex cursor-auto items-center justify-center bg-black/70 px-3 py-3 backdrop-blur-md sm:px-4 sm:py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${site.name} case study`}
    >
      <motion.div
        className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-agency-border bg-agency-bg shadow-2xl sm:max-h-[calc(100dvh-2rem)]"
        initial={{ y: 24, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 24, scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        style={{ touchAction: "pan-y" }}
      >
        <div className="flex items-center justify-between border-b border-agency-border bg-agency-surface px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-agency-muted">
              Live website case study
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-agency-ink sm:text-3xl">
              {site.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            onPointerDown={(event) => event.stopPropagation()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-agency-border text-agency-muted transition-colors hover:border-agency-ink hover:text-agency-ink"
            aria-label="Close case study"
          >
            ×
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
          <div className="min-h-0 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
            <div className="space-y-6">
              <section className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
                  Quick view
                </p>
                <p className="text-sm leading-relaxed text-agency-muted sm:text-base">
                  <span className="font-semibold text-agency-text">Client:</span> {site.client}
                </p>
                <p className="text-sm leading-relaxed text-agency-muted sm:text-base">
                  <span className="font-semibold text-agency-text">Package:</span> {site.relatedService}
                </p>
                <p className="text-sm leading-relaxed text-agency-muted sm:text-base">
                  <span className="font-semibold text-agency-text">Outcome:</span> {site.result}
                </p>
              </section>

              <section className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
                  Problem
                </p>
                <p className="text-sm leading-relaxed text-agency-muted sm:text-base">{site.problem}</p>
                <p className="text-sm leading-relaxed text-agency-muted sm:text-base">{site.beforeAfter}</p>
              </section>

              <section className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
                  Solution
                </p>
                <p className="text-sm leading-relaxed text-agency-muted sm:text-base">{site.solution}</p>
              </section>

              <section className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
                  Proof notes
                </p>
                <ul className="space-y-2 text-sm leading-relaxed text-agency-muted sm:text-base">
                  {site.proofLibrary.slice(0, 2).map((item) => (
                    <li key={item.label} className="rounded-2xl border border-agency-border bg-agency-surface px-4 py-3">
                      <span className="font-semibold text-agency-text">{item.label}:</span> {item.text}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
                  Services link
                </p>
                <p className="text-sm leading-relaxed text-agency-muted sm:text-base">
                  This case study connects back to the Aperix service that delivered it.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-full border border-agency-ink px-4 py-2.5 text-sm font-semibold text-agency-ink transition-colors hover:bg-agency-ink hover:text-white"
                >
                  View services
                </Link>
              </section>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto border-t border-agency-border bg-agency-surface/70 px-5 py-5 lg:border-t-0 lg:border-l sm:px-6 sm:py-6">
            <div className="space-y-5">
              <div className="overflow-hidden rounded-3xl border border-agency-border bg-agency-surface shadow-[0_20px_60px_rgba(0,0,0,0.10)]">
                <div className="relative h-96 w-full overflow-hidden border-t border-agency-border bg-agency-bg">
                  {"preview" in site && site.preview ? (
                    <img
                      src={site.preview}
                      alt={`Preview of ${site.name}`}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  ) : (
                    <iframe
                      src={site.href}
                      title={`Preview of ${site.name}`}
                      className="pointer-events-none absolute left-0 top-0 h-225 w-360 origin-top-left select-none"
                      style={{ transform: "scale(0.42)", transformOrigin: "top left" }}
                      loading="lazy"
                      tabIndex={-1}
                      aria-hidden="true"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-agency-border bg-agency-bg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-agency-muted">
                    Live site
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-agency-muted">
                    Open the live build once you are done reviewing the case study.
                  </p>
                  <a
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-agency-border bg-agency-surface px-4 py-2.5 text-sm font-semibold text-agency-text transition-colors hover:border-agency-accent hover:text-agency-accent"
                  >
                    Open live site
                  </a>
                </div>

                <div className="rounded-2xl border border-agency-border bg-agency-bg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-agency-muted">
                    Summary
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-agency-muted">
                    {site.summary}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {site.scope.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-agency-border bg-agency-surface px-3 py-1.5 text-xs font-medium text-agency-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({
  site,
  theme,
  offset,
  isActive,
  hasMounted,
  onClick,
  onOpenCaseStudy,
}: {
  site: Site;
  theme: (typeof CARD_THEMES)[number];
  offset: number;
  isActive: boolean;
  hasMounted: boolean;
  onClick: () => void;
  onOpenCaseStudy: () => void;
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
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      } as React.CSSProperties}
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
            <>
              {/* Static placeholder — shown for every card except the live front card.
                  Keeps the deck cheap to composite: only the active iframe ever paints. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center bg-agency-surface"
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-agency-muted">
                  Live preview
                </span>
              </div>
              {/* Mount the iframe only once a card has been the active card, then keep
                  it mounted (no reload flash on swipe-back) but only PAINT it while it
                  is the front card via `visibility`. */}
              {hasMounted ? (
                <iframe
                  src={site.href}
                  title={`Preview of ${site.name}`}
                  className="pointer-events-none absolute left-0 top-0 h-225 w-360 origin-top-left select-none"
                  style={{
                    transform: "scale(0.235)",
                    transformOrigin: "top left",
                    visibility: isActive ? "visible" : "hidden",
                  }}
                  loading="lazy"
                  tabIndex={-1}
                  aria-hidden="true"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : null}
            </>
          )}
        </div>

        {/* Visit button */}
        <div className="border-t border-agency-border bg-agency-surface px-6 py-4">
          {site.href ? (
            <button
              type="button"
              tabIndex={isActive ? 0 : -1}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${theme.btn}`}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onOpenCaseStudy();
              }}
            >
              View case study
            </button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

export default function LiveSitesSection() {
  const [active, setActive] = useState(0);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const dragStartX = useRef(0);

  // Track which cards have ever been the front card. We only mount a live iframe
  // once its card first reaches the front, so the page never spins up all five
  // external sites at once (which previously saturated the GPU compositor and made
  // the fixed backdrop-blur header flash/break).
  const [mountedFrames, setMountedFrames] = useState<Set<number>>(() => new Set([0]));
  useEffect(() => {
    setMountedFrames((prev) => {
      if (prev.has(active)) return prev;
      const next = new Set(prev);
      next.add(active);
      return next;
    });
  }, [active]);

  const goTo = useCallback((index: number) => {
    setActive(((index % TOTAL) + TOTAL) % TOTAL);
  }, []);

  const openCaseStudy = useCallback((index: number) => {
    const normalizedIndex = ((index % TOTAL) + TOTAL) % TOTAL;
    setActive(normalizedIndex);
    setSelectedSite(LIVE_SITES[normalizedIndex] ?? null);
  }, []);

  const closeCaseStudy = useCallback(() => {
    setSelectedSite(null);
  }, []);

  useEffect(() => {
    if (!selectedSite) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCaseStudy();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCaseStudy, selectedSite]);

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
      className="overflow-hidden px-6 py-24 sm:py-28 lg:px-12 lg:py-36"
      aria-labelledby="live-sites-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
              Live Aperix-Made Websites
            </p>
            <h2
              id="live-sites-heading"
              className="font-display text-3xl font-bold leading-tight text-agency-ink sm:text-4xl lg:text-5xl"
            >
              Live website launches and case studies.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-agency-muted sm:text-lg">
              A few of the projects we have shipped, each one built for a real business with a real brief, clear scope, and a measurable outcome.
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

        <div className="mt-14 flex justify-center overflow-hidden">
          <div
            className="relative select-none"
            style={{ height: "clamp(620px, 70vh, 780px)", width: "min(100%, 420px)", touchAction: "pan-y" }}
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
                  hasMounted={mountedFrames.has(i)}
                  onClick={() => goTo(i)}
                  onOpenCaseStudy={() => openCaseStudy(i)}
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

        <AnimatePresence>
          {selectedSite ? (
            <CaseStudyModal site={selectedSite} onClose={closeCaseStudy} />
          ) : null}
        </AnimatePresence>


      </div>
    </section>
  );
}
