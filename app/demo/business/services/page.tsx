import { ApexNav } from "@/components/demos/business/ApexNav";
import ApexServicesPage from "@/components/demos/business/ApexServicesPage";
import ApexCTABanner from "@/components/demos/business/ApexCTABanner";
import ApexFooter from "@/components/demos/business/ApexFooter";

/* ────────────────────────────────────────────────────────────
   /demo/business/services — PRD §8.3.3
   6 services with filter tabs: All · Residential · Commercial · Emergency
   ──────────────────────────────────────────────────────────── */

export const metadata = {
  title: "Services — Apex Electrical | Aperix Demo",
};

export default function BusinessServicesPage() {
  return (
    <>
      <ApexNav />
      <main>
        <ApexServicesPage />
        <ApexCTABanner />
      </main>
      <ApexFooter />
    </>
  );
}
