import { ApexNav } from "@/components/demos/business/ApexNav";
import ApexAboutPage from "@/components/demos/business/ApexAboutPage";
import ApexCTABanner from "@/components/demos/business/ApexCTABanner";
import ApexFooter from "@/components/demos/business/ApexFooter";

/* ────────────────────────────────────────────────────────────
   /demo/business/about — PRD §8.3.4
   Founder James Kowalski, team, licences, community
   ──────────────────────────────────────────────────────────── */

export const metadata = {
  title: "About — Apex Electrical | Aperix Demo",
};

export default function BusinessAboutPage() {
  return (
    <>
      <ApexNav />
      <main>
        <ApexAboutPage />
        <ApexCTABanner />
      </main>
      <ApexFooter />
    </>
  );
}
