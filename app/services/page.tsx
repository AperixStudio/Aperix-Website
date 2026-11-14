import type { Metadata } from "next";
import Footer from "@/components/agency/Footer";
import HomeContactSection from "@/components/agency/HomeContactSection";
import ServicesIndex from "@/components/agency/ServicesIndex";
import { buildServicesPageSchema } from "@/lib/schema/siteSchema";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Web design & software development services | Aperix Studio",
  description:
    "Web design, web apps, software, mobile apps, and an AI receptionist from Aperix Studio in Melbourne. Each project is scoped, then quoted.",
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
        <HomeContactSection />
      </main>

      <Footer />
    </>
  );
}
