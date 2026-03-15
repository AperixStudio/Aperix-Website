/* ────────────────────────────────────────────────────────────
   ApexWhyChoose — PRD §8.3.2
   4-column icon grid — why choose Apex
   ──────────────────────────────────────────────────────────── */

const reasons = [
  {
    icon: "⚡",
    title: "Fast Response",
    body: "Same-day service for urgent jobs. Emergency callouts within the hour.",
  },
  {
    icon: "💬",
    title: "Clear Pricing",
    body: "Upfront quotes with no hidden fees. You'll always know the cost before work starts.",
  },
  {
    icon: "🎓",
    title: "Fully Qualified",
    body: "Licensed master electricians with 10+ years experience across all job types.",
  },
  {
    icon: "🤝",
    title: "Richmond Locals",
    body: "We live and work in inner Melbourne — we care about our community's reputation.",
  },
];

export default function ApexWhyChoose() {
  return (
    <section className="bg-[#0c0a09] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
            Why Apex?
          </p>
          <h2 className="font-(family-name:--font-apex-heading) text-3xl font-extrabold text-white md:text-4xl">
            Why Richmond chooses us
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {reasons.map(({ icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-1 hover:ring-[#f59e0b]/40"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f59e0b]/10 text-2xl">
                {icon}
              </div>
              <h3 className="font-(family-name:--font-apex-heading) text-base font-bold text-white">
                {title}
              </h3>
              <p className="mt-2 font-(family-name:--font-apex-body) text-sm leading-relaxed text-white/60">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
