/* ────────────────────────────────────────────────────────────
   ApexTrustBadges — PRD §8.3.2
   5 trust badges in a horizontal strip
   ──────────────────────────────────────────────────────────── */

const badges = [
  { icon: "🔐", label: "Fully Licensed", sub: "Lic. EC12345" },
  { icon: "🛡️", label: "$20M Insured", sub: "Public liability" },
  { icon: "⭐", label: "4.9 Google Rating", sub: "500+ reviews" },
  { icon: "⚡", label: "24/7 Emergency", sub: "Always available" },
  { icon: "✅", label: "10+ Years Exp.", sub: "Richmond locals" },
];

export default function ApexTrustBadges() {
  return (
    <section className="border-y border-[#292524] bg-[#1c1917] py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {badges.map(({ icon, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="text-3xl" aria-hidden="true">
                {icon}
              </span>
              <p className="font-(family-name:--font-apex-heading) text-sm font-bold text-white">
                {label}
              </p>
              <p className="font-(family-name:--font-apex-body) text-xs text-white/50">
                {sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
