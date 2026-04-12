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

export default function SocialProofBar() {
  /* Duplicate the list so the second copy seamlessly follows the first */
  const items = [...PHRASES, ...PHRASES];

  return (
    <section
      aria-label="Areas we serve"
      className="relative overflow-hidden border-t border-agency-border bg-agency-surface py-4"
    >
      {/* Edge fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-agency-surface to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-agency-surface to-transparent"
      />

      {/* Marquee track */}
      <div className="marquee-track flex w-max gap-10">
        {items.map((phrase, i) => (
          <span
            key={`${phrase}-${i}`}
            className="shrink-0 text-xs font-medium tracking-[0.15em] uppercase text-agency-muted whitespace-nowrap"
          >
            {phrase}
          </span>
        ))}
      </div>
    </section>
  );
}
