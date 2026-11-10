import type { Metadata } from "next";
import BubbleNav from "@/components/agency/BubbleNav";
import Footer from "@/components/agency/Footer";
import ServicePageStub from "@/components/agency/ServicePageStub";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Custom ecommerce websites in Melbourne | Aperix Studio",
  description: "Custom ecommerce websites in Melbourne, from Aperix Studio.",
  path: "/ecommerce-websites",
  index: false,
});

export default function EcommerceWebsitesPage() {
  return (
    <>
      <main id="main-content" className="overflow-x-hidden">
        <ServicePageStub title="Custom ecommerce websites in Melbourne" />
      </main>
      <Footer />
      <BubbleNav />
    </>
  );
}
