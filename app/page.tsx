import type { Metadata } from "next";
import dynamic from "next/dynamic";
/** Airport-style split-flap board — cycles studio phrases below hero. @see SOCIAL_PROOF_BOARD_IMPLEMENTATION_BRIEF.md */
import SocialProofBoard from "@/components/agency/SocialProofBoard";
import HeroV4 from "@/components/agency/HeroV4";
import BackToTop from "@/components/agency/BackToTop";
import Footer from "@/components/agency/Footer";
import AgencyNavV2 from "@/components/agency/AgencyNavV2";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

const LiveSitesSectionV2 = dynamic(() => import("@/components/agency/LiveSitesSectionV2"), {
  loading: () => <div className="home-section-placeholder home-section-placeholder--our-work" aria-hidden />,
});

const AboutWallTransitionSection = dynamic(
  () => import("@/components/agency/AboutWallTransitionSection"),
  {
    loading: () => <div className="home-section-placeholder home-section-placeholder--about" aria-hidden />,
  },
);

const HomeContactSection = dynamic(() => import("@/components/agency/HomeContactSection"), {
  loading: () => <div className="home-section-placeholder home-section-placeholder--contact" aria-hidden />,
});

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
      <HeroV4 />
      <SocialProofBoard />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
        />
        <LiveSitesSectionV2 />
        <AboutWallTransitionSection />
        <HomeContactSection />
        <BackToTop />
      </main>
      <Footer />
    </>
  );
}
