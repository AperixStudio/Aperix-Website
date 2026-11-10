import { type Metadata } from "next";
import BubbleNav from "@/components/agency/BubbleNav";
import Footer from "@/components/agency/Footer";
import HomeContactSection from "@/components/agency/HomeContactSection";
import { buildLocalBusinessSchema } from "@/lib/schema/siteSchema";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";
import { getSiteUrl } from "@/lib/site";

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
  title: "Contact | Aperix Studio",
  description:
    "Contact Aperix Studio about custom web design, development, and support for your Melbourne business.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <main id="main-content" className="overflow-x-hidden pt-52 lg:pt-44">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusinessSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
        />
        <HomeContactSection headingAs="h1" headingId="contact-heading" />
      </main>

      <Footer />
      <BubbleNav />
    </>
  );
}
