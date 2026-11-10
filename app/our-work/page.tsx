import type { Metadata } from "next";
import BubbleNav from "@/components/agency/BubbleNav";
import Footer from "@/components/agency/Footer";
import HomeContactSection from "@/components/agency/HomeContactSection";
import WorkIndex from "@/components/agency/WorkIndex";
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
    "Case studies from Aperix Studio: a booking studio, a shop, a web app, and trade websites.",
  isPartOf: {
    "@id": `${siteUrl}/#website`,
  },
  about: {
    "@id": `${siteUrl}/#organization`,
  },
};

export const metadata: Metadata = buildPageMetadata({
  title: "Our Work | Aperix Studio",
  description:
    "Case studies from Aperix Studio: a booking studio, a shop, a web app, and trade websites.",
  path: "/our-work",
});

export default function OurWorkPage() {
  return (
    <>
      <main id="main-content" className="overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
        />
        <WorkIndex />
        <HomeContactSection />
      </main>

      <Footer />

      <BubbleNav />
    </>
  );
}
