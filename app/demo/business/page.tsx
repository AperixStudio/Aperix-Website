import { ApexNav } from "@/components/demos/business/ApexNav";
import ApexHero from "@/components/demos/business/ApexHero";
import ApexStatCounters from "@/components/demos/business/ApexStatCounters";
import ApexTrustBadges from "@/components/demos/business/ApexTrustBadges";
import ApexServicesSnapshot from "@/components/demos/business/ApexServicesSnapshot";
import ApexWhyChoose from "@/components/demos/business/ApexWhyChoose";
import ApexProjects from "@/components/demos/business/ApexProjects";
import ApexReviews from "@/components/demos/business/ApexReviews";
import ApexCTABanner from "@/components/demos/business/ApexCTABanner";
import ApexFooter from "@/components/demos/business/ApexFooter";

/* ────────────────────────────────────────────────────────────
   /demo/business — PRD §8
   Apex Electrical — Business tier ($1,799).
   Multi-page site with stat counters, filter tabs, Zod forms.
   ──────────────────────────────────────────────────────────── */

export default function BusinessDemoPage() {
  return (
    <>
      <ApexNav />
      <main>
        <ApexHero />
        <ApexStatCounters />
        <ApexTrustBadges />
        <ApexServicesSnapshot />
        <ApexWhyChoose />
        <ApexProjects />
        <ApexReviews />
        <ApexCTABanner />
      </main>
      <ApexFooter />
    </>
  );
}
