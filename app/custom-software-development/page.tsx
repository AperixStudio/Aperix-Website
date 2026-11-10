import type { Metadata } from "next";
import BubbleNav from "@/components/agency/BubbleNav";
import Footer from "@/components/agency/Footer";
import ServicePageStub from "@/components/agency/ServicePageStub";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Custom software development in Melbourne | Aperix Studio",
  description: "Custom software development in Melbourne, from Aperix Studio.",
  path: "/custom-software-development",
  index: false,
});

export default function CustomSoftwareDevelopmentPage() {
  return (
    <>
      <main id="main-content" className="overflow-x-hidden">
        <ServicePageStub title="Custom software development in Melbourne" />
      </main>
      <Footer />
      <BubbleNav />
    </>
  );
}
