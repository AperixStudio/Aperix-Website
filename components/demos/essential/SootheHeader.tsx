import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   SootheHeader — PRD §6.3.1
   Sticky white header. Logo left, phone CTA right.
  NO nav links (Basic tier constraint).
   ──────────────────────────────────────────────────────────── */

export default function SootheHeader() {
  return (
    <header className="sticky top-(--demo-banner-h) z-40 border-b border-[#e8e3dc] bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        {/* wordmark */}
        <Link
          href="#"
          className="font-(family-name:--font-soothe) text-xl font-bold tracking-wide text-[#7a9e87]"
        >
          Soothe
        </Link>

        {/* phone CTA */}
        <a
          href="tel:0400000000"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#7a9e87] px-5 py-2.5 font-(family-name:--font-soothe) text-sm font-semibold text-white transition-colors hover:bg-[#5c7a67]"
        >
          <span aria-hidden="true">📞</span>
          Book Now
        </a>
      </div>
    </header>
  );
}
