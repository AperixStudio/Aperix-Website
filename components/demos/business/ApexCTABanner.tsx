import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   ApexCTABanner — PRD §8.3.2
   Full-width amber CTA banner
   ──────────────────────────────────────────────────────────── */

export default function ApexCTABanner() {
  return (
    <section className="bg-[#f59e0b] py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-(family-name:--font-apex-heading) text-3xl font-extrabold text-[#0c0a09] md:text-4xl">
          Need an electrician today?
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-(family-name:--font-apex-body) text-base text-[#0c0a09]/70">
          We&apos;re available 24/7 for emergencies and offer same-day
          scheduling for non-urgent work across Richmond and inner Melbourne.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/demo/business/contact"
            className="inline-flex items-center justify-center rounded-md bg-[#0c0a09] px-7 py-3 font-(family-name:--font-apex-body) text-sm font-semibold text-[#f59e0b] transition-all hover:scale-[1.03] hover:bg-[#1c1917] active:scale-[0.97]"
          >
            Get a Free Quote
          </Link>
          <a
            href="tel:0390000000"
            className="inline-flex items-center justify-center rounded-md border-2 border-[#0c0a09]/30 px-7 py-3 font-(family-name:--font-apex-body) text-sm font-semibold text-[#0c0a09] transition-all hover:scale-[1.03] hover:border-[#0c0a09] active:scale-[0.97]"
          >
            ⚡ Call (03) 9000 0000
          </a>
        </div>
      </div>
    </section>
  );
}
