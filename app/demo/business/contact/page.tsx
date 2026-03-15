import { ApexNav } from "@/components/demos/business/ApexNav";
import ApexContactForm from "@/components/demos/business/ApexContactForm";
import ApexFooter from "@/components/demos/business/ApexFooter";

/* ────────────────────────────────────────────────────────────
   /demo/business/contact — PRD §8.3.5
   Zod-validated form with loading spinner and success state.
   Contact details sidebar.
   ──────────────────────────────────────────────────────────── */

export const metadata = {
  title: "Contact — Apex Electrical | Aperix Demo",
};

export default function BusinessContactPage() {
  return (
    <>
      <ApexNav />
      <main>
        {/* Page hero */}
        <section className="bg-[#0c0a09] py-16 text-center">
          <div className="mx-auto max-w-3xl px-6">
            <p className="mb-3 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
              Get in Touch
            </p>
            <h1 className="font-(family-name:--font-apex-heading) text-4xl font-extrabold text-white md:text-5xl">
              Request a free quote
            </h1>
            <p className="mx-auto mt-5 max-w-xl font-(family-name:--font-apex-body) text-base leading-relaxed text-white/60">
              Fill in the form below and we&apos;ll get back to you within 24
              hours with a no-obligation quote.
            </p>
          </div>
        </section>

        {/* Form + Sidebar */}
        <section className="bg-[#111110] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Form — 2 cols */}
              <div className="lg:col-span-2">
                <ApexContactForm />
              </div>

              {/* Sidebar — 1 col */}
              <aside className="flex flex-col gap-5">
                {/* Phone */}
                <div className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f59e0b]/10 text-xl">
                    📞
                  </div>
                  <p className="font-(family-name:--font-apex-heading) text-sm font-bold text-white">
                    Call us
                  </p>
                  <a
                    href="tel:0390000000"
                    className="mt-1 block font-(family-name:--font-apex-body) text-sm text-[#f59e0b] transition-colors hover:text-[#d97706]"
                  >
                    (03) 9000 0000
                  </a>
                  <p className="mt-1 font-(family-name:--font-apex-body) text-xs text-white/40">
                    Mon – Fri 7am – 6pm<br />
                    Sat 8am – 2pm
                  </p>
                </div>

                {/* Emergency */}
                <div className="rounded-xl bg-[#f59e0b]/10 p-6 ring-1 ring-[#f59e0b]/20">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f59e0b]/20 text-xl">
                    ⚡
                  </div>
                  <p className="font-(family-name:--font-apex-heading) text-sm font-bold text-white">
                    24/7 Emergency
                  </p>
                  <a
                    href="tel:0390000000"
                    className="mt-1 block font-(family-name:--font-apex-body) text-sm font-semibold text-[#f59e0b] transition-colors hover:text-[#d97706]"
                  >
                    (03) 9000 0000
                  </a>
                  <p className="mt-1 font-(family-name:--font-apex-body) text-xs text-white/60">
                    Power out? Sparks? Call now — we&apos;re available around
                    the clock.
                  </p>
                </div>

                {/* Email */}
                <div className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f59e0b]/10 text-xl">
                    ✉️
                  </div>
                  <p className="font-(family-name:--font-apex-heading) text-sm font-bold text-white">
                    Email
                  </p>
                  <a
                    href="mailto:info@apexelectrical.com.au"
                    className="mt-1 block font-(family-name:--font-apex-body) text-sm text-[#f59e0b] transition-colors hover:text-[#d97706]"
                  >
                    info@apexelectrical.com.au
                  </a>
                </div>

                {/* Location */}
                <div className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f59e0b]/10 text-xl">
                    📍
                  </div>
                  <p className="font-(family-name:--font-apex-heading) text-sm font-bold text-white">
                    Service area
                  </p>
                  <p className="mt-1 font-(family-name:--font-apex-body) text-sm text-white/60">
                    Richmond VIC 3121<br />
                    Serving all inner Melbourne suburbs
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <ApexFooter />
    </>
  );
}
