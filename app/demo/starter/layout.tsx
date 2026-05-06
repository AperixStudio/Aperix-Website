import {
  Playfair_Display,
  Lato,
  DM_Mono,
} from "next/font/google";
import DemoBanner from "@/components/demos/DemoBanner";
import HearthstoneNav from "@/components/demos/hearthstone/HearthstoneNav";
import HearthstoneFooter from "@/components/demos/hearthstone/HearthstoneFooter";

/* ── Hearthstone fonts (PRD §6.2) ───────────────────────── */
const playfairDisplay = Playfair_Display({
  variable: "--font-hs-display",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-hs-body",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-hs-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Hearthstone Café — Fitzroy | Aperix Demo",
  description:
    "A demo Growth-tier website for Hearthstone Café, an independent café in Fitzroy, Melbourne. Built by Aperix Studio.",
};

export default function StarterDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${playfairDisplay.variable} ${lato.variable} ${dmMono.variable}`}
      style={
        {
          /* demo banner height — consumed by sticky nav */
          "--demo-banner-h": "60px",
        } as React.CSSProperties
      }
    >
      <DemoBanner
        tierName="Growth"
        description="This is a demo showcasing our Growth tier ($1,290). A polished multi-page small-business site with menu, about, reviews, and contact pages."
      />
      {/* offset for fixed banner */}
      <div className="bg-[#faf7f2] pt-15 text-[#2d2520]">
        <HearthstoneNav />
        {children}
        <HearthstoneFooter />
      </div>
    </div>
  );
}
