/* ────────────────────────────────────────────────────────────
   SootheHero — PRD §6.3.2
   Full-viewport centred hero with CSS blob backgrounds
   (sage bottom-right, gold top-left), trust line.
   NO Framer Motion — Essential tier constraint.
   ──────────────────────────────────────────────────────────── */

export default function SootheHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f5f2]">
      {/* ── CSS blob backgrounds ──────────────────────── */}
      {/* large sage blob — bottom right */}
      <div
        aria-hidden="true"
        className="absolute -right-24 -bottom-24 h-105 w-105 rounded-full bg-[#c8ddd0]/50 blur-3xl sm:h-135 sm:w-135"
      />
      {/* small gold blob — top left */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -left-16 h-65 w-65 rounded-full bg-[#c9a96e]/25 blur-3xl"
      />

      {/* content */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-32 text-center">
        {/* overline */}
        <p className="mb-5 font-(family-name:--font-soothe) text-xs font-semibold uppercase tracking-[0.25em] text-[#8a8078]">
          Mobile Massage · Inner Melbourne
        </p>

        {/* H1 */}
        <h1 className="font-(family-name:--font-soothe) text-4xl font-bold leading-tight text-[#3a3530] md:text-5xl">
          Relaxation, delivered to your door.
        </h1>

        {/* subtext */}
        <p className="mx-auto mt-5 max-w-md font-(family-name:--font-soothe) text-base leading-relaxed text-[#8a8078]">
          Professional remedial &amp; relaxation massage in the comfort of your
          own home. Serving Melbourne&apos;s inner suburbs.
        </p>

        {/* CTA */}
        <div className="mt-8">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-2xl bg-[#7a9e87] px-8 py-3.5 font-(family-name:--font-soothe) text-sm font-semibold text-white transition-colors hover:bg-[#5c7a67]"
          >
            Book a Session
          </a>
        </div>

        {/* trust line */}
        <p className="mt-8 font-(family-name:--font-soothe) text-sm text-[#8a8078]">
          <span aria-hidden="true">⭐</span> 5.0 · 40+ happy clients · Police
          checked · Insured
        </p>
      </div>
    </section>
  );
}
