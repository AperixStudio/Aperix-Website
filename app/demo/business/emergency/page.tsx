import { type Metadata } from "next";
import Link from "next/link";
import ApexCTA from "@/components/demos/business/ApexCTA";

export const metadata: Metadata = {
  title: "Emergency Electrician — Apex Electrical Richmond | Aperix Demo",
  description:
    "A Pro-tier landing page for emergency electrical call-outs, demonstrating service-specific pages and conversion-focused enquiry flow.",
};

const steps = [
  ["1", "Call answered", "A qualified electrician triages the issue and checks immediate safety risks."],
  ["2", "Fault isolated", "On arrival, Apex tests the affected circuit and makes the area safe."],
  ["3", "Repair planned", "You get a clear recommendation, quote, and next step before permanent work starts."],
];

export default function ApexEmergencyPage() {
  return (
    <main>
      <section className="bg-[#0f172a] px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
              24/7 Emergency Electrical
            </p>
            <h1 className="mt-4 font-(family-name:--font-apex-display) text-4xl font-bold leading-tight text-white md:text-5xl">
              A dedicated high-intent landing page for urgent jobs.
            </h1>
            <p className="mt-5 max-w-2xl font-(family-name:--font-apex-body) text-base leading-relaxed text-white/70">
              This page demonstrates a Pro-tier service landing page: focused messaging, fast contact options, and a clear explanation of what happens during an emergency call-out.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="tel:0396001234" className="rounded-lg bg-[#f59e0b] px-6 py-3 text-center font-(family-name:--font-apex-body) text-sm font-bold text-[#0f172a] transition-colors hover:bg-[#d97706]">
                Call Now
              </Link>
              <Link href="/demo/business/contact" className="rounded-lg border border-white/20 px-6 py-3 text-center font-(family-name:--font-apex-body) text-sm font-bold text-white transition-colors hover:bg-white/10">
                Request Help Online
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl">
            <p className="font-(family-name:--font-apex-body) text-sm font-semibold text-[#f59e0b]">Typical response</p>
            <p className="mt-3 font-(family-name:--font-apex-display) text-5xl font-bold">45 min</p>
            <p className="mt-3 font-(family-name:--font-apex-body) text-sm leading-relaxed text-white/65">Average metro response window shown as a conversion-focused proof point.</p>
          </div>
        </div>
      </section>
      <section className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {steps.map(([number, title, text]) => (
            <article key={title} className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fa] p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d4ed8] font-(family-name:--font-apex-body) text-sm font-bold text-white">{number}</span>
              <h2 className="mt-5 font-(family-name:--font-apex-display) text-xl font-bold text-[#0f172a]">{title}</h2>
              <p className="mt-3 font-(family-name:--font-apex-body) text-sm leading-relaxed text-[#64748b]">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <ApexCTA />
    </main>
  );
}
