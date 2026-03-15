/* ────────────────────────────────────────────────────────────
   SootheAbout — PRD §6.3.4
   Two-column: circular CSS gradient portrait left, bio right.
   Emma's story, Cert IV credentials, AAMT membership.
   ──────────────────────────────────────────────────────────── */

export default function SootheAbout() {
  return (
    <section className="bg-[#f7f5f2] py-20 lg:py-28">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        {/* left — circular portrait placeholder */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="h-72 w-72 overflow-hidden rounded-full bg-linear-to-br from-[#c8ddd0] to-[#7a9e87] lg:h-80 lg:w-80">
              <div className="flex h-full items-center justify-center">
                <span className="font-(family-name:--font-soothe) text-xs font-semibold uppercase tracking-widest text-white/50">
                  Portrait
                </span>
              </div>
            </div>
            {/* subtle decorative ring */}
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-full border-2 border-dashed border-[#c8ddd0]/50"
            />
          </div>
        </div>

        {/* right — bio text */}
        <div className="flex flex-col justify-center text-center lg:text-left">
          <p className="mb-3 font-(family-name:--font-soothe) text-xs font-semibold uppercase tracking-[0.2em] text-[#7a9e87]">
            About Me
          </p>
          <h2 className="font-(family-name:--font-soothe) text-3xl font-bold text-[#3a3530] md:text-4xl">
            Hi, I&apos;m Emma.
          </h2>

          <div className="mt-5 space-y-4 font-(family-name:--font-soothe) text-base leading-relaxed text-[#8a8078]">
            <p>
              I started Soothe because I believe quality massage shouldn&apos;t
              mean fighting for parking or rushing across town after a long day.
              I bring everything to you — table, linens, music, the lot — so
              you can relax in your own space.
            </p>
            <p>
              I hold a Certificate IV in Massage Therapy and I&apos;m a
              registered member of the Australian Association of Massage
              Therapists (AAMT). I&apos;ve worked with everyone from office
              workers with desk posture issues to weekend athletes recovering
              from training.
            </p>
            <p>
              I&apos;m fully insured, police checked, and genuinely love what I
              do. If you&apos;re in Melbourne&apos;s inner suburbs, I&apos;d
              love to help you feel better.
            </p>
          </div>

          {/* credential badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            <span className="rounded-full bg-[#c8ddd0]/40 px-4 py-1.5 font-(family-name:--font-soothe) text-xs font-semibold text-[#5c7a67]">
              Cert IV Massage Therapy
            </span>
            <span className="rounded-full bg-[#c8ddd0]/40 px-4 py-1.5 font-(family-name:--font-soothe) text-xs font-semibold text-[#5c7a67]">
              AAMT Member
            </span>
            <span className="rounded-full bg-[#c8ddd0]/40 px-4 py-1.5 font-(family-name:--font-soothe) text-xs font-semibold text-[#5c7a67]">
              Fully Insured
            </span>
            <span className="rounded-full bg-[#c8ddd0]/40 px-4 py-1.5 font-(family-name:--font-soothe) text-xs font-semibold text-[#5c7a67]">
              Police Checked
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
