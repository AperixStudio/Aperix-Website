/* ────────────────────────────────────────────────────────────
   ApexProjects — PRD §8.3.2
   4 project cards with hover overlay effect
   ──────────────────────────────────────────────────────────── */

const projects = [
  {
    title: "Complete Rewire — Fitzroy Terrace",
    category: "Residential",
    description: "Full house rewire, new switchboard, and safety upgrades for an 1890s terrace.",
    bg: "bg-[#78350f]",
  },
  {
    title: "Commercial Fit-out — South Yarra",
    category: "Commercial",
    description: "New office electrical, data cabling, and emergency lighting for a 400m² tenancy.",
    bg: "bg-[#1c1917]",
  },
  {
    title: "Emergency Fault — Richmond Flat",
    category: "Emergency",
    description: "After-hours fault diagnosis and repair restoring power to a residential complex.",
    bg: "bg-[#292524]",
  },
  {
    title: "Solar & Battery — Hawthorn",
    category: "Residential",
    description: "6.6kW solar system with 10kWh battery storage, maximising household energy savings.",
    bg: "bg-[#451a03]",
  },
];

export default function ApexProjects() {
  return (
    <section className="bg-[#111110] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
            Portfolio
          </p>
          <h2 className="font-(family-name:--font-apex-heading) text-3xl font-extrabold text-white md:text-4xl">
            Recent projects
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map(({ title, category, description, bg }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-xl ${bg} ring-1 ring-white/10`}
            >
              {/* Card body */}
              <div className="p-6">
                <span className="mb-3 inline-block rounded-full bg-[#f59e0b]/20 px-3 py-1 font-(family-name:--font-apex-body) text-xs font-semibold text-[#f59e0b]">
                  {category}
                </span>
                <h3 className="font-(family-name:--font-apex-heading) text-base font-bold leading-snug text-white">
                  {title}
                </h3>
                <div className="mt-8 h-16" />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-[#0c0a09]/90 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="mb-2 inline-block rounded-full bg-[#f59e0b]/20 px-3 py-1 font-(family-name:--font-apex-body) text-xs font-semibold text-[#f59e0b]">
                  {category}
                </span>
                <h3 className="font-(family-name:--font-apex-heading) text-base font-bold leading-snug text-white">
                  {title}
                </h3>
                <p className="mt-2 font-(family-name:--font-apex-body) text-sm leading-relaxed text-white/70">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
