import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   ApexServicesSnapshot — PRD §8.3.2
   3 service snapshot cards → /demo/business/services
   ──────────────────────────────────────────────────────────── */

const services = [
  {
    icon: "🏠",
    title: "Residential",
    description:
      "Rewiring, switchboard upgrades, power points, lighting design, and safety inspections for Melbourne homes.",
  },
  {
    icon: "🏢",
    title: "Commercial",
    description:
      "Full electrical fit-outs, data cabling, emergency lighting, and compliance testing for businesses.",
  },
  {
    icon: "🚨",
    title: "Emergency",
    description:
      "Power outages, tripped circuits, and electrical faults. Available 24/7 with rapid response across inner Melbourne.",
  },
];

export default function ApexServicesSnapshot() {
  return (
    <section className="bg-[#111110] py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
            What We Do
          </p>
          <h2 className="font-(family-name:--font-apex-heading) text-3xl font-extrabold text-white md:text-4xl">
            Electrical services you can rely on
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {services.map(({ icon, title, description }) => (
            <div
              key={title}
              className="group rounded-xl bg-white/5 p-7 ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-1 hover:ring-[#f59e0b]/50"
            >
              <span className="text-3xl" aria-hidden="true">
                {icon}
              </span>
              <h3 className="mt-4 font-(family-name:--font-apex-heading) text-xl font-bold text-white">
                {title}
              </h3>
              <p className="mt-2 font-(family-name:--font-apex-body) text-sm leading-relaxed text-white/60">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/demo/business/services"
            className="inline-flex items-center gap-2 font-(family-name:--font-apex-body) text-sm font-semibold text-[#f59e0b] transition-colors hover:text-[#d97706]"
          >
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}
