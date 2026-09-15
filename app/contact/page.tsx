import { type Metadata } from "next";
import AgencyNavV2 from "@/components/agency/AgencyNavV2";
import Footer from "@/components/agency/Footer";
import ContactForm from "@/components/agency/ContactForm";
import BackToTop from "@/components/agency/BackToTop";
import { buildLocalBusinessSchema } from "@/lib/schema/siteSchema";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";
import { getSiteUrl } from "@/lib/site";
import "./ContactPage.css";

const siteUrl = getSiteUrl();

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
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

export const metadata: Metadata = buildPageMetadata({
  title: "Contact — Aperix Studio",
  description:
    "Contact Aperix Studio about custom web design, development, and support for your Melbourne business.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <AgencyNavV2 />

      <main
        id="main-content"
        className="contact-page overflow-hidden px-4 pt-20 pb-6 sm:px-6 lg:px-8 lg:pt-24 lg:pb-8"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusinessSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
        />
        <div className="contact-page__shell mx-auto h-full max-w-6xl">
          <ContactForm
            kicker="A 30-second briefing"
            heading="Contact us about web design in Melbourne."
            headingId="contact-heading"
            headingAs="h1"
            lede="Four short questions. We'll reply within 24 hours."
          />
        </div>
      </main>

      <BackToTop />
      <Footer />
    </>
  );
}
