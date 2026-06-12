import { type Metadata } from "next";
import AgencyNavV2 from "@/components/agency/AgencyNavV2";
import Footer from "@/components/agency/Footer";
import ContactForm from "@/components/agency/ContactForm";
import BackToTop from "@/components/agency/BackToTop";
import { getSiteUrl, SITE_EMAIL, SITE_LOGO_PATH, SITE_NAME, SITE_SOCIAL_LINKS } from "@/lib/site";

const siteUrl = getSiteUrl();
const siteLogoUrl = `${siteUrl}${SITE_LOGO_PATH}`;

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/contact#localbusiness`,
  name: SITE_NAME,
  url: siteUrl,
  logo: siteLogoUrl,
  email: SITE_EMAIL,
  sameAs: SITE_SOCIAL_LINKS,
  areaServed: {
    "@type": "City",
    name: "Melbourne",
  },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteUrl}/contact#webpage`,
  url: `${siteUrl}/contact`,
  name: "Contact Aperix Studio",
  description:
    "Contact Aperix Studio about custom web design, development, and support for Melbourne businesses.",
  isPartOf: {
    "@id": `${siteUrl}/#website`,
  },
  about: {
    "@id": `${siteUrl}/#organization`,
  },
};

/* ────────────────────────────────────────────────────────────
   /contact — PRD §10
   Two-column: dark left panel + form right panel
   ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Contact — Aperix Studio",
  description:
    "Contact Aperix Studio about custom web design, development, and support for your Melbourne business.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact — Aperix Studio",
    description:
      "Contact Aperix Studio about custom web design, development, and support for your Melbourne business.",
    url: `${siteUrl}/contact`,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Aperix Studio",
    description:
      "Contact Aperix Studio about custom web design, development, and support for your Melbourne business.",
  },
};

export default function ContactPage() {
  return (
    <>
      <AgencyNavV2 />

      <main
        role="main"
        className="h-[calc(100dvh-4.75rem)] overflow-hidden px-6 pt-20 pb-4 lg:h-[calc(100dvh-4.5rem)] lg:pt-24 lg:pb-4"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
        />
        <div className="mx-auto grid h-full max-w-6xl overflow-hidden rounded-4xl border border-agency-border lg:grid-cols-[36%_64%]">
          {/* ── Left panel ─────────────────────────── */}
          <div className="flex h-full flex-col justify-center bg-agency-surface px-7 py-8 lg:px-9 lg:py-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-accent">
              Contact Aperix Studio
            </p>
            <h1 className="font-display text-3xl font-bold text-agency-text sm:text-[2rem]">
              Contact us about web design in Melbourne.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-agency-muted">
              Tell us what your business needs, and we&apos;ll reply with the best-fit package, a clear next step, and the timeline to expect.
            </p>
          </div>

          {/* ── Right panel — form ──────────────────── */}
          <div className="h-full bg-agency-bg/65 backdrop-blur-sm">
            <ContactForm />
          </div>
        </div>
      </main>

      <BackToTop />
      <Footer />
    </>
  );
}
