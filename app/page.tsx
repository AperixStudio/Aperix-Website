import type { Metadata } from "next";
import SocialProofBar from "@/components/agency/SocialProofBar";
import HomeStorySection from "@/components/agency/HomeStorySection";
import TierShowcase from "@/components/agency/TierShowcase";
import LiveSitesSection from "@/components/agency/LiveSitesSection";
import FinalCTA from "@/components/agency/FinalCTA";
import BackToTop from "@/components/agency/BackToTop";
import Footer from "@/components/agency/Footer";
import AgencyNavV2 from "@/components/agency/AgencyNavV2";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

const siteUrl = getSiteUrl();

const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteUrl}/#webpage`,
  url: siteUrl,
  name: `${SITE_NAME} | Custom Web Development Melbourne`,
  description:
    "Aperix Studio builds custom websites and software for Melbourne businesses, with clear messaging, fast performance, and ongoing support.",
  isPartOf: {
    "@id": `${siteUrl}/#website`,
  },
  about: {
    "@id": `${siteUrl}/#organization`,
  },
};

export const metadata: Metadata = {
  title: "Aperix Studio | Custom Web Development Melbourne",
  description:
    "Aperix Studio builds custom websites and software for Melbourne businesses, with clear messaging, fast performance, and ongoing support.",
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    title: "Aperix Studio | Custom Web Development Melbourne",
    description:
      "Aperix Studio builds custom websites and software for Melbourne businesses, with clear messaging, fast performance, and ongoing support.",
    url: siteUrl,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aperix Studio | Custom Web Development Melbourne",
    description:
      "Aperix Studio builds custom websites and software for Melbourne businesses, with clear messaging, fast performance, and ongoing support.",
  },
};

export default function Home() {
  return (
    <>
      <AgencyNavV2 />
      <HomeStorySection />
      <div className="winding-section winding-section-left">
        <SocialProofBar />
      </div>
      <main className="overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
        />
        <div className="winding-section winding-section-left">
          <TierShowcase />
        </div>
        <div className="winding-section winding-section-right">
          <LiveSitesSection />
        </div>
        <div className="winding-section winding-section-left">
          <FinalCTA />
        </div>
        <BackToTop />
      </main>
      <Footer />
    </>
  );
}
