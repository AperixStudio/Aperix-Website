import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   SocialProofBar — PRD §4.2.3
   Full-width section directly below hero. Dark background,
   subtle top border. Horizontally scrolling marquee of
   Melbourne suburb / industry phrases.
   Pure CSS animation — no JavaScript.
   ──────────────────────────────────────────────────────────── */

const PHRASES = [
  "Fitzroy · Hospitality",
  "Richmond · Trades",
  "South Yarra · Med Spa",
  "Collingwood · Retail",
  "Hawthorn · Professional Services",
  "Brunswick · Creative",
  "Prahran · Health & Beauty",
  "CBD · Corporate",
];

const PHRASE_STYLES = [
  "text-agency-accent",
  "text-agency-accent2",
  "text-agency-accent3",
  "text-agency-ink",
] as const;

export default function SocialProofBar() {
  /* Duplicate the list so the second copy seamlessly follows the first */
  const items = [...PHRASES, ...PHRASES];

  return (
    <section aria-label="Areas we serve" className="px-6 py-6 lg:px-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-full border border-agency-border/80 bg-linear-to-r from-agency-surface2/70 via-agency-surface to-agency-surface2/70 px-4 py-4 shadow-[0_18px_45px_rgba(67,92,122,0.06)]">
        {/* Edge fades */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-agency-bg to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-agency-bg to-transparent"
        />

        {/* Marquee track */}
        <div className="marquee-track flex w-max gap-10">
          {items.map((phrase, i) => (
            <span
              key={`${phrase}-${i}`}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border border-agency-border/70 bg-agency-bg/70 px-3 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase",
                PHRASE_STYLES[i % PHRASE_STYLES.length],
              )}
            >
              {phrase}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
