import type { Metadata } from "next";
import AgencyNavV2 from "@/components/agency/AgencyNavV2";
import Footer from "@/components/agency/Footer";
import BackToTop from "@/components/agency/BackToTop";
import AboutPageHero from "@/components/agency/AboutPageHero";
import { buildAboutPageSchema } from "@/lib/schema/siteSchema";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us | Aperix Studio",
  description:
    "Meet Aperix Studio — a two-person web development team in Melbourne building custom websites, web apps, and SaaS products.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AgencyNavV2 />
      <main id="main-content" className="overflow-x-hidden bg-[#0c1017]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildAboutPageSchema()) }}
        />
        <AboutPageHero />
      </main>
      <BackToTop />
      <Footer />
    </>
  );
}
