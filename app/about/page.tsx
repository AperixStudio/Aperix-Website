import type { Metadata } from "next";
import AboutFoundersSection from "@/components/agency/AboutFoundersSection";
import BubbleNav from "@/components/agency/BubbleNav";
import Footer from "@/components/agency/Footer";
import HomeAboutSection from "@/components/agency/HomeAboutSection";
import { buildAboutPageSchema } from "@/lib/schema/siteSchema";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us | Aperix Studio",
  description:
    "Meet Aperix Studio, a two-person web development team in Melbourne building custom websites, web apps, and SaaS products.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <main id="main-content" className="about-page overflow-x-hidden pt-44 sm:pt-28">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildAboutPageSchema()) }}
        />
        <HomeAboutSection headingLevel="h1" />
        <AboutFoundersSection />
      </main>
      <Footer />
      <BubbleNav />
    </>
  );
}
