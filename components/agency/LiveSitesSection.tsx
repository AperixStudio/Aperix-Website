import Link from "next/link";
import { HoverLift, ParallaxLayer, Reveal, StaggerGroup, StaggerItem } from "@/components/animations";
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
    highlights: ["Story-led homepage", "Giftable product positioning", "Warm branded shopping flow"],
  },
  {
    name: "Rhino's Walk",
    href: "https://admirable-axolotl-39bf5e.netlify.app/",
    location: "Melbourne, VIC",
    status: "Live now",
    label: "Fundraiser / community campaign",
    summary:
      "A campaign site for a 24-hour community walk supporting the Good Friday Appeal. It is designed to explain the cause quickly, highlight impact, and make it easy for supporters to donate or join the walk.",
    highlights: ["Donation-first CTA flow", "Impact-driven storytelling", "Community event structure"],
  },
  {
    name: "POV Sync",
    href: "https://pov-sync.onrender.com/",
    location: "Web app",
    status: "Live now",
    label: "SaaS / streaming product",
    summary:
      "A multi-POV streaming tool that brings YouTube and Twitch feeds into one synced view. The product site focuses on fast onboarding, clear feature communication, and a simple path into the host setup flow.",
    highlights: ["Product-led landing page", "Fast setup onboarding", "Multi-stream UX messaging"],
  },
] as const;

const SITE_STYLES = [
  {
    badge: "border-agency-accent/25 bg-agency-accent/12 text-agency-accent",
    panel: "from-agency-accent/14 via-agency-surface to-agency-bg",
    highlight: "border-agency-accent/20 bg-agency-accent/10",
  },
  {
    badge: "border-agency-accent2/25 bg-agency-accent2/12 text-agency-accent2",
    panel: "from-agency-accent2/14 via-agency-surface to-agency-bg",
    highlight: "border-agency-accent2/20 bg-agency-accent2/10",
  },
  {
    badge: "border-agency-accent3/25 bg-agency-accent3/12 text-agency-accent3",
    panel: "from-agency-accent3/14 via-agency-surface to-agency-bg",
    highlight: "border-agency-accent3/20 bg-agency-accent3/10",
  },
] as const;

export default function LiveSitesSection() {
  return (
    <section
      id="live-sites"
      className="px-6 py-20 lg:px-12 lg:py-32"
      aria-labelledby="live-sites-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal className="max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
              Recent Launches
            </p>
            <h2
              id="live-sites-heading"
              className="font-display text-3xl font-bold leading-tight text-agency-ink sm:text-4xl lg:text-5xl"
            >
              A few live builds, with more on the way.
            </h2>
          </Reveal>

          <Reveal>
            <Link
              href="/contact"
              className="agency-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors"
            >
              Get in Contact
            </Link>
          </Reveal>
        </div>

        <StaggerGroup className="mt-10 grid gap-6 lg:grid-cols-3" staggerChildren={0.08}>
          {LIVE_SITES.map((site, index) => {
            const isLive = Boolean(site.href);
            const styles = SITE_STYLES[index % SITE_STYLES.length];

            return (
              <StaggerItem
                key={`${site.name}-${index}`}
                className={
                  index === 0
                    ? "overflow-hidden rounded-4xl border border-agency-border bg-agency-surface lg:col-span-2"
                    : "overflow-hidden rounded-4xl border border-agency-border bg-agency-surface"
                }
              >
                <HoverLift scale={index === 0 ? 1.012 : 1.008}>
                <article className="overflow-hidden rounded-4xl border border-agency-border bg-agency-surface">
                <div className={cn("border-b border-agency-border bg-linear-to-br px-6 py-8 sm:px-8", styles.panel)}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={cn("rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]", styles.badge)}>
                      {site.status}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-agency-muted">
                      {site.location}
                    </span>
                  </div>

                  <ParallaxLayer className="mt-6 flex min-h-48 flex-col justify-between rounded-[1.75rem] border border-agency-border/70 bg-white/40 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" offset={index === 0 ? 18 : 10}>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-agency-muted">
                        {site.label}
                      </p>
                      <h3 className="mt-3 font-display text-3xl font-bold text-agency-ink sm:text-4xl">
                        {site.name}
                      </h3>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <p className="font-mono text-xs text-agency-muted">
                        {isLive ? new URL(site.href).hostname : "Reserved for next approved launch"}
                      </p>
                      <span className="text-sm font-medium text-agency-ink">
                        {isLive ? "Visit live site" : "Coming soon"}
                      </span>
                    </div>
                  </ParallaxLayer>
                </div>

                <div className="space-y-5 px-6 py-6 sm:px-8">
                  <p className="max-w-2xl text-sm leading-relaxed text-agency-muted sm:text-base">
                    {site.summary}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {site.highlights.map((item) => (
                      <div
                        key={item}
                        className={cn("rounded-2xl border px-4 py-4 text-sm text-agency-text", styles.highlight)}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {isLive ? (
                    <Link
                      href={site.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-agency-ink transition-colors hover:text-agency-accent"
                    >
                      Open {new URL(site.href).hostname}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  ) : (
                    <p className="text-sm font-medium text-agency-muted">
                      This will change to a live link once the next approved project is public.
                    </p>
                  )}
                </div>
                </article>
                </HoverLift>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        <Reveal className="mt-10 rounded-4xl border border-agency-border bg-agency-surface px-6 py-6 sm:px-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <p className="max-w-3xl text-sm leading-relaxed text-agency-muted sm:text-base">
              We’ll keep adding approved client work here over time, with live links,
              short project notes, and enough context to show what each build involved.
            </p>
            <Link
              href="/contact"
              className="agency-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              Talk to us about your project
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
