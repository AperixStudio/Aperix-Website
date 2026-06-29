import type { Metadata } from "next";
import Link from "next/link";
import AgencyNavV2 from "@/components/agency/AgencyNavV2";
import LiveSitesSection from "@/components/agency/LiveSitesSection";
import Footer from "@/components/agency/Footer";
import BackToTop from "@/components/agency/BackToTop";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteUrl}/our-work#webpage`,
  url: `${siteUrl}/our-work`,
  name: "Our Work | Aperix Studio",
  description:
    "Live case studies and project examples from Aperix Studio, including e-commerce, community, SaaS, and trades websites.",
  isPartOf: {
    "@id": `${siteUrl}/#website`,
  },
  about: {
    "@id": `${siteUrl}/#organization`,
  },
};

const WORK_TYPES = [
  { label: "E-commerce", className: "border-agency-accent/25 bg-agency-accent/10 text-agency-accent" },
  { label: "Community", className: "border-agency-accent2/25 bg-agency-accent2/10 text-agency-accent2" },
  { label: "SaaS", className: "border-agency-accent3/25 bg-agency-accent3/10 text-agency-accent3" },
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: "Our Work | Aperix Studio",
  description:
    "Browse live case studies from Aperix Studio, with project context, launch status, and examples of the work we ship for Melbourne businesses.",
  path: "/our-work",
});

export default function OurWorkPage() {
  return (
    <>
      <AgencyNavV2 />
      <main id="main-content" className="overflow-x-hidden pt-28">
        <section className="px-6 pb-6 pt-10 lg:px-12 lg:pb-10 lg:pt-14">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-4xl border border-agency-border bg-linear-to-br from-agency-surface via-agency-bg to-agency-surface2 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-12 lg:py-14">
            <div className="max-w-3xl">
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
              />
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-muted">
                Live Projects
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-agency-ink sm:text-5xl lg:text-6xl">
                Website case studies for businesses Aperix has created.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-agency-muted sm:text-lg">
                See live examples of websites Aperix has launched for e-commerce, community, SaaS, and trades businesses across Melbourne and Victoria.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {WORK_TYPES.map((type) => (
                  <span
                    key={type.label}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${type.className}`}
                  >
                    {type.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/contact"
                className="agency-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                Start your project
              </Link>
              <Link
                href="/services"
                className="agency-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors"
              >
                View services
              </Link>
            </div>
          </div>
        </section>

        <LiveSitesSection />
      </main>
      <BackToTop />
      <Footer />
    </>
  );
}