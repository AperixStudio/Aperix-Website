/* ────────────────────────────────────────────────────────────
   SootheServices — PRD §6.3.3
   3 service cards: Remedial $95, Relaxation $85, Corporate $60.
   CSS hover tint only — NO JavaScript interactions.
   ──────────────────────────────────────────────────────────── */

const services = [
  {
    title: "Remedial Massage",
    price: "$95",
    duration: "60 min",
    description:
      "Targeted deep-tissue work for chronic tension, injury recovery, and postural imbalances. Health fund rebates available.",
    icon: "💪",
  },
  {
    title: "Relaxation Massage",
    price: "$85",
    duration: "60 min",
    description:
      "Full-body Swedish-style massage to ease stress, improve circulation, and leave you feeling completely restored.",
    icon: "🧘",
  },
  {
    title: "Corporate Chair Massage",
    price: "$60",
    duration: "per person",
    description:
      "On-site seated massage for your team. Perfect for wellness days, team events, or regular office bookings.",
    icon: "🪑",
  },
];

export default function SootheServices() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        {/* heading */}
        <h2 className="font-(family-name:--font-soothe) text-3xl font-bold text-[#3a3530] md:text-4xl">
          What I offer
        </h2>
        <p className="mx-auto mt-3 max-w-md font-(family-name:--font-soothe) text-base text-[#8a8078]">
          Simple, honest pricing. No hidden fees, no upselling.
        </p>

        {/* cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-[#e8e3dc] bg-[#fdf9f4] p-7 text-center transition-colors hover:bg-[#c8ddd0]/20"
            >
              <span className="text-3xl" aria-hidden="true">
                {service.icon}
              </span>

              <h3 className="mt-4 font-(family-name:--font-soothe) text-lg font-bold text-[#3a3530]">
                {service.title}
              </h3>

              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="font-(family-name:--font-soothe) text-2xl font-bold text-[#7a9e87]">
                  {service.price}
                </span>
                <span className="font-(family-name:--font-soothe) text-sm text-[#8a8078]">
                  / {service.duration}
                </span>
              </div>

              <p className="mt-4 font-(family-name:--font-soothe) text-sm leading-relaxed text-[#8a8078]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
