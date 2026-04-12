import Link from "next/link";

const LIVE_SITES = [
  {
    name: "Aperix Studio",
    href: "https://aperix.com.au",
    location: "Melbourne, VIC",
    status: "Live now",
    label: "Agency website",
    summary:
      "Our own live site — built as the agency shell, with demo pathways, pricing, service detail, and contact conversion flows.",
    highlights: ["Homepage + service architecture", "Lead-focused contact flow", "Reusable demo showcase system"],
  },
  {
    name: "Next Client Launch",
    href: "",
    location: "Reserved",
    status: "Launching soon",
    label: "Client slot",
    summary:
      "This space is ready for the next public launch once a client site is approved to be showcased.",
    highlights: ["Live domain", "Project summary", "Before/after scope"],
  },
  {
    name: "Next Client Launch",
    href: "",
    location: "Reserved",
    status: "Launching soon",
    label: "Client slot",
    summary:
      "As more websites go live, we’ll add them here with direct links and a quick breakdown of what was delivered.",
    highlights: ["Industry", "Key pages delivered", "Outcome or conversion goal"],
  },
] as const;

export default function LiveSitesSection() {
  return (
    <section
      id="live-sites"
      className="bg-agency-bg px-6 py-20 lg:px-12 lg:py-32"
      aria-labelledby="live-sites-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
              Recent Launches
            </p>
            <h2
              id="live-sites-heading"
              className="font-display text-3xl font-bold leading-tight text-agency-ink sm:text-4xl lg:text-5xl"
            >
              Live websites we can point you to — with more launches ready to join the list.
            </h2>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-agency-border-dark px-5 py-3 text-sm font-semibold text-agency-ink transition-colors hover:border-agency-accent hover:text-agency-accent"
          >
            Book a project call
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {LIVE_SITES.map((site, index) => {
            const isLive = Boolean(site.href);

            return (
              <article
                key={`${site.name}-${index}`}
                className={
                  index === 0
                    ? "overflow-hidden rounded-4xl border border-agency-border bg-agency-surface lg:col-span-2"
                    : "overflow-hidden rounded-4xl border border-agency-border bg-agency-surface"
                }
              >
                <div className="border-b border-agency-border bg-linear-to-br from-agency-surface2 via-agency-surface to-agency-bg px-6 py-8 sm:px-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-agency-border bg-white/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-agency-ink">
                      {site.status}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-agency-muted">
                      {site.location}
                    </span>
                  </div>

                  <div className="mt-6 flex min-h-48 flex-col justify-between rounded-[1.75rem] border border-agency-border/70 bg-white/40 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
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
                  </div>
                </div>

                <div className="space-y-5 px-6 py-6 sm:px-8">
                  <p className="max-w-2xl text-sm leading-relaxed text-agency-muted sm:text-base">
                    {site.summary}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {site.highlights.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-agency-border bg-agency-bg px-4 py-4 text-sm text-agency-text"
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
                      This card will switch to a live link once the next project is public.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-4xl border border-agency-border bg-agency-surface px-6 py-6 sm:px-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <p className="max-w-3xl text-sm leading-relaxed text-agency-muted sm:text-base">
              Inspired by the stronger “latest projects” storytelling on Clean Vibes, this
              section is now set up to grow into a proper live portfolio — with direct links,
              location or industry tags, and quick notes on what each build included.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-agency-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start your website
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
