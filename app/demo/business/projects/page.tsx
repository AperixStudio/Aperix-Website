import { type Metadata } from "next";
import RecentProjects from "@/components/demos/business/RecentProjects";
import ApexCTA from "@/components/demos/business/ApexCTA";

export const metadata: Metadata = {
  title: "Projects — Apex Electrical Richmond | Aperix Demo",
  description:
    "A Pro-tier project gallery page for Apex Electrical, showing a deeper custom site structure beyond the homepage.",
};

const projectNotes = [
  ["Commercial Fit-Out", "Richmond office", "Lighting plan, data cabling, compliance testing, and staged handover for a growing professional team."],
  ["Switchboard Upgrade", "Fitzroy terrace", "Modern safety switches, surge protection, labelled circuits, and certificate documentation."],
  ["Emergency Fault Repair", "Collingwood retail", "After-hours fault isolation, temporary restoration, and permanent repair plan for trading continuity."],
];

export default function ApexProjectsPage() {
  return (
    <main>
      <section className="bg-[#0f172a] px-6 py-16 text-center lg:py-20">
        <p className="font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
          Project Gallery
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-(family-name:--font-apex-display) text-4xl font-bold text-white md:text-5xl">
          Recent work with enough detail to build trust.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-(family-name:--font-apex-body) text-base leading-relaxed text-white/70">
          Pro-tier demos should show deeper page structure, stronger proof, and a clearer enquiry path than a single-page site.
        </p>
      </section>
      <RecentProjects />
      <section className="bg-[#f8f9fa] px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {projectNotes.map(([title, location, summary]) => (
            <article key={title} className="rounded-xl border border-[#e2e8f0] bg-white p-7 shadow-sm">
              <p className="font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">{location}</p>
              <h2 className="mt-3 font-(family-name:--font-apex-display) text-xl font-bold text-[#0f172a]">{title}</h2>
              <p className="mt-3 font-(family-name:--font-apex-body) text-sm leading-relaxed text-[#64748b]">{summary}</p>
            </article>
          ))}
        </div>
      </section>
      <ApexCTA />
    </main>
  );
}
