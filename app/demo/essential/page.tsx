import { type Metadata } from "next";
import SootheHeader from "@/components/demos/essential/SootheHeader";
import SootheHero from "@/components/demos/essential/SootheHero";

export const metadata: Metadata = {
  title: "Soothe Mobile Massage — Inner Melbourne | Aperix Demo",
  description: "Demo Essential-tier site for Soothe Mobile Massage, an independent mobile massage therapist in inner Melbourne.",
};
import SootheServices from "@/components/demos/essential/SootheServices";
import SootheAbout from "@/components/demos/essential/SootheAbout";
import SootheServiceArea from "@/components/demos/essential/SootheServiceArea";
import SootheTestimonials from "@/components/demos/essential/SootheTestimonials";
import SootheContact from "@/components/demos/essential/SootheContact";
import SootheFooter from "@/components/demos/essential/SootheFooter";

/* ────────────────────────────────────────────────────────────
   /demo/essential — PRD §6
   Soothe Mobile Massage — Essential tier ($499).
   Single-page site. No Framer Motion. No multi-route.
   ──────────────────────────────────────────────────────────── */

export default function EssentialDemoPage() {
  return (
    <>
      <SootheHeader />
      <main>
        <SootheHero />
        <SootheServices />
        <SootheAbout />
        <SootheServiceArea />
        <SootheTestimonials />
        <SootheContact />
      </main>
      <SootheFooter />
    </>
  );
}
