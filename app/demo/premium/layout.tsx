import { Cormorant_Garamond, Jost } from "next/font/google";
import DemoBanner from "@/components/demos/DemoBanner";
import LuminaNav from "@/components/demos/premium/LuminaNav";
import LuminaFooter from "@/components/demos/premium/LuminaFooter";
import LuminaPageTransition from "@/components/demos/premium/LuminaPageTransition";

/* ── Lumina fonts (PRD §9.2) ─────────────────────────────── */
const cormorant = Cormorant_Garamond({
  variable: "--font-lm-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-lm-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Lumina Med Spa — South Yarra | Aperix Demo",
  description:
    "A demo Premium-tier website for Lumina Med Spa, a luxury medical aesthetics clinic in South Yarra. Built by Aperix Studio.",
};

export default function PremiumDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${cormorant.variable} ${jost.variable}`}
      style={{ "--demo-banner-h": "60px" } as React.CSSProperties}
    >
      <DemoBanner
        tierName="Premium"
        description="👋 This is a demo showcasing our Premium tier ($5,999+). Luxury editorial design with page transitions, parallax, animated filters, and a two-step booking flow."
      />
      <div className="pt-15">
        <LuminaNav />
        <LuminaPageTransition>{children}</LuminaPageTransition>
        <LuminaFooter />
      </div>
    </div>
  );
}
