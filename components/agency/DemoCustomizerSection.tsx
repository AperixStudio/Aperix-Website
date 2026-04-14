import Link from "next/link";
import { HoverLift, ParallaxLayer, Reveal, StaggerGroup, StaggerItem } from "@/components/animations";

const DEMO_OPTIONS = [
  {
    tier: "Starter",
    href: "/demo/starter",
    tone: "Warm, independent, local",
    summary:
      "Great for cafés, bars, trades, and neighbourhood businesses that want personality without overcomplication.",
    ideas: ["Header style", "Homepage layout", "Menu or services flow"],
  },
  {
    tier: "Essential",
    href: "/demo/essential",
    tone: "Soft, calm, service-led",
    summary:
      "Useful for solo operators and appointment-based businesses that need trust, clarity, and easy booking paths.",
    ideas: ["Colour direction", "Testimonials", "Service-page structure"],
  },
  {
    tier: "Business",
    href: "/demo/business",
    tone: "Direct, confident, conversion-focused",
    summary:
      "Best for companies that want a stronger commercial feel, clear calls to action, and a more established presence.",
    ideas: ["Lead-gen layout", "Proof sections", "Quote flow"],
  },
  {
    tier: "Premium",
    href: "/demo/premium",
    tone: "Editorial, premium, high-trust",
    summary:
      "A good reference for premium service brands that want a more elevated visual system and smoother storytelling.",
    ideas: ["Luxury styling", "Page pacing", "Booking experience"],
  },
] as const;

const STEPS = [
  "Open the demo that feels closest to your business.",
  "Make a note of what you like — layout, colours, sections, wording, or flow.",
  "Send us the links and your notes, and we’ll shape the final direction around that.",
] as const;

const STATS = [
  { value: "4", label: "starting points to work from" },
  { value: "Mix & match", label: "sections and ideas across demos" },
  { value: "Faster", label: "briefing and quoting process" },
  { value: "Clearer", label: "feedback than vague references" },
] as const;

export default function DemoCustomizerSection() {
  return (
    <section
      id="demo-brief"
      className="px-4 py-4 sm:px-6 lg:px-8"
      aria-labelledby="demo-brief-heading"
    >
      <div className="agency-panel-wrap mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Reveal>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
              Use The Demos As A Brief
            </p>
            <h2
              id="demo-brief-heading"
              className="font-display text-3xl font-bold leading-tight text-agency-ink sm:text-4xl lg:text-5xl"
            >
              Use the demos to show us what feels right.
            </h2>
          </Reveal>

          <Reveal className="space-y-5">
            <p className="max-w-xl text-base leading-relaxed text-agency-muted sm:text-lg">
              Most people find it easier to react to something they can see. The demos are
              there to make that easier. You can point out what feels right, what doesn’t,
              and what you’d like us to combine or change.
            </p>
            <StaggerGroup className="space-y-3" staggerChildren={0.06}>
              {STEPS.map((step, index) => (
                <StaggerItem key={step}>
                  <div className="flex items-start gap-3 text-sm leading-relaxed text-agency-text">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-agency-border bg-agency-bg text-xs font-semibold text-agency-ink">
                      0{index + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Reveal>
        </div>

        <StaggerGroup className="mt-10 grid gap-px overflow-hidden rounded-4xl border border-agency-border bg-agency-border sm:grid-cols-2 xl:grid-cols-4" staggerChildren={0.05}>
          {STATS.map((stat) => (
            <StaggerItem key={stat.label} preset="scaleIn" className="bg-agency-bg px-6 py-6">
              <p className="font-display text-2xl font-bold text-agency-ink">{stat.value}</p>
              <p className="mt-1 text-sm leading-relaxed text-agency-muted">{stat.label}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <StaggerGroup className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4" staggerChildren={0.08}>
          {DEMO_OPTIONS.map((demo, index) => (
            <StaggerItem key={demo.tier}>
            <HoverLift>
            <article className="overflow-hidden rounded-4xl border border-agency-border bg-agency-bg">
              <div className="relative overflow-hidden border-b border-agency-border bg-linear-to-br from-agency-surface2 via-agency-surface to-agency-bg px-6 py-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-agency-muted">
                      Demo 0{index + 1}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-agency-ink">
                      {demo.tier}
                    </h3>
                  </div>
                  <span className="rounded-full border border-agency-border bg-white/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-agency-ink">
                    {demo.tone}
                  </span>
                </div>

                <ParallaxLayer className="mt-8 rounded-2xl border border-agency-border/80 bg-white/45 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]" offset={14}>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <p className="mt-4 font-mono text-xs text-agency-muted">{demo.href}</p>
                  <p className="mt-3 text-sm leading-relaxed text-agency-text">
                    If this overall feel is close, tell us what you’d keep,
                    change, remove, or combine with another direction.
                  </p>
                </ParallaxLayer>
              </div>

              <div className="space-y-5 px-6 py-6">
                <p className="text-sm leading-relaxed text-agency-muted">{demo.summary}</p>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-agency-text">
                    Good for referencing
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {demo.ideas.map((idea) => (
                      <span
                        key={idea}
                        className="rounded-full border border-agency-border bg-agency-surface px-3 py-1.5 text-xs font-medium text-agency-muted"
                      >
                        {idea}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={demo.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-agency-ink transition-colors hover:text-agency-accent"
                >
                  Open demo
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
            </HoverLift>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal className="mt-10 flex flex-col gap-4 rounded-4xl border border-agency-border bg-agency-bg px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-3xl text-sm leading-relaxed text-agency-muted sm:text-base">
            You can mix ideas across demos too — the layout from one, the tone from another,
            and the content structure from a third. We use that input to shape something that
            suits your business, not to copy a template page for page.
          </p>
          <Link
            href="/#tiers"
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-agency-border-dark px-5 py-3 text-sm font-semibold text-agency-ink transition-colors hover:border-agency-accent hover:text-agency-accent"
          >
            Compare all demos
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
