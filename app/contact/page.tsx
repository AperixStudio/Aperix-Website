import { type Metadata } from "next";
import AgencyNavV2 from "@/components/agency/AgencyNavV2";
import Footer from "@/components/agency/Footer";
import ContactForm from "@/components/agency/ContactForm";
import BackToTop from "@/components/agency/BackToTop";
import { getSiteUrl, SITE_EMAIL, SITE_LOGO_PATH, SITE_NAME, SITE_SOCIAL_LINKS } from "@/lib/site";
import "./ContactPage.css";

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
        className="contact-page overflow-hidden px-4 pt-20 pb-6 sm:px-6 lg:px-8 lg:pt-24 lg:pb-8"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
        />
        <div className="contact-page__shell mx-auto h-full max-w-6xl">
          <div className="contact-page__intro">
            <p className="contact-page__kicker">Contact Aperix Studio</p>
            <h1 className="contact-page__heading">
              Contact us about web design in Melbourne.
            </h1>
            <p className="contact-page__lede">
              Tell us what your business needs, and we&apos;ll reply with the best-fit package, a
              clear next step, and the timeline to expect.
            </p>
          </div>

          <div className="contact-page__form">
            <ContactForm />
          </div>
        </div>
      </main>

      <BackToTop />
      <Footer />
    </>
  );
}
