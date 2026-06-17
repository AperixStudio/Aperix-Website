import type { Metadata } from "next";
import AgencyNavV2 from "@/components/agency/AgencyNavV2";
import Footer from "@/components/agency/Footer";
import BackToTop from "@/components/agency/BackToTop";
import AboutPageHero from "@/components/agency/AboutPageHero";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${siteUrl}/about#webpage`,
  url: `${siteUrl}/about`,
  name: "About Us | Aperix Studio",
  description:
    "Meet Aperix Studio — a two-person web development team in Melbourne building custom websites, web apps, and SaaS products.",
  isPartOf: {
    "@id": `${siteUrl}/#website`,
  },
  about: {
    "@id": `${siteUrl}/#organization`,
  },
};

export const metadata: Metadata = {
  title: "About Us | Aperix Studio",
  description:
    "Meet Aperix Studio — a two-person web development team in Melbourne building custom websites, web apps, and SaaS products.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About Us | Aperix Studio",
    description:
      "Meet Aperix Studio — a two-person web development team in Melbourne building custom websites, web apps, and SaaS products.",
    url: `${siteUrl}/about`,
    siteName: "Aperix Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Aperix Studio",
    description:
      "Meet Aperix Studio — a two-person web development team in Melbourne building custom websites, web apps, and SaaS products.",
  },
};

export default function AboutPage() {
  return (
    <>
      <AgencyNavV2 />
      <main className="overflow-x-hidden bg-[#0c1017]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
        />
        <AboutPageHero />
      </main>
      <BackToTop />
      <Footer />
    </>
  );
}
