import { Syne, Inter } from "next/font/google";
import DemoBanner from "@/components/demos/DemoBanner";
import ApexNav from "@/components/demos/business/ApexNav";
import ApexFooter from "@/components/demos/business/ApexFooter";

/* ── Apex Electrical fonts (PRD §8.2) ────────────────────── */
const syne = Syne({
  variable: "--font-apex-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-apex-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Apex Electrical — Richmond | Aperix Demo",
  description:
    "A demo Business-tier website for Apex Electrical, a licenced electrical contractor in Richmond, Melbourne. Built by Aperix Studio.",
};

export default function BusinessDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${syne.variable} ${inter.variable}`}
      style={
        {
          "--demo-banner-h": "60px",
        } as React.CSSProperties
      }
    >
      <DemoBanner
        tierName="Business"
        description="This is a demo showcasing our Business tier ($3,290). Multi-page with form validation, stat counters, and service filtering."
      />
      {/* offset for fixed banner */}
      <div className="pt-15">
        <ApexNav />
        <main>{children}</main>
        <ApexFooter />
      </div>
    </div>
  );
}
