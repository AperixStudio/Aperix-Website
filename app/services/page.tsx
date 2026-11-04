import type { Metadata } from "next";
import BubbleNav from "@/components/agency/BubbleNav";
import Footer from "@/components/agency/Footer";
import ServicesIndex from "@/components/agency/ServicesIndex";
import { buildServicesPageSchema } from "@/lib/schema/siteSchema";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Services | Aperix Studio",
  description:
    "Web design, web apps and SaaS, software development, and app development from Aperix Studio, a two-person team in Melbourne.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <main id="main-content" className="overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildServicesPageSchema()) }}
        />
        <ServicesIndex />
      </main>

      <Footer />

      <BubbleNav />
    </>
  );
}
