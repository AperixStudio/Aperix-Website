/* ────────────────────────────────────────────────────────────
   ApexAboutPage — PRD §8.3.4
   Founder James Kowalski, 3 team members, licences, community
   ──────────────────────────────────────────────────────────── */

const teamMembers = [
  {
    name: "James Kowalski",
    role: "Founder & Master Electrician",
    years: "12 years experience",
    bio: "Born and raised in Richmond, James founded Apex Electrical with a simple goal: bring honest, reliable electrical work to his community. Licensed master electrician, solar accredited.",
    initials: "JK",
  },
  {
    name: "Sophie Tran",
    role: "Senior Electrician",
    years: "8 years experience",
    bio: "Specialist in commercial fit-outs and data cabling. Sophie manages our South Melbourne and CBD commercial projects and compliance certificates.",
    initials: "ST",
  },
  {
    name: "Marcus Reid",
    role: "Electrician",
    years: "5 years experience",
    bio: "Marcus handles residential and emergency callouts across Richmond, Fitzroy, and Collingwood. Known for his calm manner and thorough explanations.",
    initials: "MR",
  },
];

const licences = [
  { badge: "🔐", label: "Victorian Electrical Licence", detail: "Lic. EC12345" },
  { badge: "☀️", label: "Clean Energy Council — Solar Accredited", detail: "CEC #78901" },
  { badge: "🛡️", label: "Public Liability Insurance", detail: "$20M insured" },
  { badge: "✅", label: "Victorian OHS Certified", detail: "Construction Induction Card" },
];

export default function ApexAboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0c0a09] py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-3 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
            About Us
          </p>
          <h1 className="font-(family-name:--font-apex-heading) text-4xl font-extrabold text-white md:text-5xl">
            Richmond&apos;s trusted electricians
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-(family-name:--font-apex-body) text-base leading-relaxed text-white/60">
            Founded in 2013, Apex Electrical has been serving Richmond and inner
            Melbourne for over 12 years. We&apos;re proud to be a local business
            with local values.
          </p>
        </div>
      </section>

      {/* Founder story */}
      <section className="bg-[#111110] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* Text */}
            <div>
              <p className="mb-3 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
                Our Story
              </p>
              <h2 className="font-(family-name:--font-apex-heading) text-3xl font-extrabold text-white md:text-4xl">
                Started by a local, for locals
              </h2>
              <p className="mt-5 font-(family-name:--font-apex-body) text-base leading-relaxed text-white/70">
                James Kowalski started Apex Electrical in 2013 after 12 years
                working for larger contractors &mdash; frustrated by the lack of
                personal service and transparent pricing in the industry.
              </p>
              <p className="mt-4 font-(family-name:--font-apex-body) text-base leading-relaxed text-white/70">
                &ldquo;I grew up in Richmond. I know these streets and these
                homes. My goal was to build a business where every customer gets
                the same standard of work I&apos;d do for my own family.&rdquo;
              </p>
              <p className="mt-3 font-(family-name:--font-apex-body) text-sm font-semibold text-[#f59e0b]">
                — James Kowalski, Founder
              </p>
            </div>

            {/* Visual */}
            <div className="flex items-center justify-center">
              <div className="relative h-72 w-72">
                {/* Amber geometric background */}
                <div
                  className="absolute inset-0 rounded-2xl bg-[#f59e0b]"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)" }}
                  aria-hidden="true"
                />
                {/* Founder avatar placeholder */}
                <div className="absolute inset-4 flex items-center justify-center rounded-xl bg-[#0c0a09]/90">
                  <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f59e0b]/20 font-(family-name:--font-apex-heading) text-3xl font-extrabold text-[#f59e0b]">
                      JK
                    </div>
                    <p className="mt-3 font-(family-name:--font-apex-heading) text-lg font-bold text-white">
                      James Kowalski
                    </p>
                    <p className="font-(family-name:--font-apex-body) text-sm text-white/50">
                      Founder · 12 years
                    </p>
                    <p className="mt-1 font-(family-name:--font-apex-body) text-xs text-white/40">
                      Richmond, Melbourne
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#0c0a09] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
              Our Team
            </p>
            <h2 className="font-(family-name:--font-apex-heading) text-3xl font-extrabold text-white md:text-4xl">
              Meet the team
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {teamMembers.map(({ name, role, years, bio, initials }) => (
              <div
                key={name}
                className="rounded-xl bg-white/5 p-7 ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-1 hover:ring-[#f59e0b]/40"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f59e0b]/20 font-(family-name:--font-apex-heading) text-lg font-extrabold text-[#f59e0b]">
                    {initials}
                  </div>
                  <div>
                    <p className="font-(family-name:--font-apex-heading) text-base font-bold text-white">
                      {name}
                    </p>
                    <p className="font-(family-name:--font-apex-body) text-xs text-[#f59e0b]">
                      {role}
                    </p>
                    <p className="font-(family-name:--font-apex-body) text-xs text-white/40">
                      {years}
                    </p>
                  </div>
                </div>
                <p className="mt-4 font-(family-name:--font-apex-body) text-sm leading-relaxed text-white/60">
                  {bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Licences & certifications */}
      <section className="bg-[#111110] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
              Credentials
            </p>
            <h2 className="font-(family-name:--font-apex-heading) text-3xl font-extrabold text-white md:text-4xl">
              Licences &amp; certifications
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {licences.map(({ badge, label, detail }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10"
              >
                <span className="text-3xl" aria-hidden="true">
                  {badge}
                </span>
                <div>
                  <p className="font-(family-name:--font-apex-heading) text-sm font-bold text-white">
                    {label}
                  </p>
                  <p className="mt-1 font-(family-name:--font-apex-body) text-xs text-white/40">
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community section */}
      <section className="bg-[#0c0a09] py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-3 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
            Community
          </p>
          <h2 className="font-(family-name:--font-apex-heading) text-3xl font-extrabold text-white md:text-4xl">
            Giving back to Richmond
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-(family-name:--font-apex-body) text-base leading-relaxed text-white/70">
            We&apos;re proud sponsors of the Richmond Football Club&apos;s
            junior leagues and donate 1% of profits to the Brotherhood of St
            Laurence, supporting disadvantaged families in inner Melbourne.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {[
              { icon: "⚽", label: "Junior Sports Sponsor" },
              { icon: "❤️", label: "1% Gives Back" },
              { icon: "🌱", label: "Carbon Neutral by 2026" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span aria-hidden="true">{icon}</span>
                <span className="font-(family-name:--font-apex-body) text-sm text-white/60">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
