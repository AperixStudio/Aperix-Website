import type { Metadata } from "next";
import BubbleNav from "@/components/agency/BubbleNav";
import Footer from "@/components/agency/Footer";
import ServicePageStub from "@/components/agency/ServicePageStub";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Websites for tradies, built in Melbourne | Aperix Studio",
  description: "Websites for tradies, built in Melbourne by Aperix Studio.",
  path: "/web-design-for-tradies",
  index: false,
});

export default function WebDesignForTradiesPage() {
  return (
    <>
      <main id="main-content" className="overflow-x-hidden">
        <ServicePageStub title="Websites for tradies, built in Melbourne" />
      </main>
      <Footer />
      <BubbleNav />
    </>
  );
}
