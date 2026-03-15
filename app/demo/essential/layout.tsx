import { Nunito } from "next/font/google";
import DemoBanner from "@/components/demos/DemoBanner";

/* ── Soothe font (PRD §6.2) ─────────────────────────────── */
const nunito = Nunito({
  variable: "--font-soothe",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Soothe Mobile Massage — Inner Melbourne | Aperix Demo",
  description:
    "A demo Essential-tier website for Soothe Mobile Massage, an independent mobile massage therapist in inner Melbourne. Built by Aperix Studio.",
};

export default function EssentialDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={nunito.variable}
      style={
        {
          /* demo banner height — consumed by sticky header */
          "--demo-banner-h": "60px",
        } as React.CSSProperties
      }
    >
      <DemoBanner
        tierName="Essential"
        description="This is a demo showcasing our Essential tier ($499). A single-page site that gets a sole trader online fast."
      />
      {/* offset for fixed banner */}
      <div className="pt-15">{children}</div>
    </div>
  );
}
