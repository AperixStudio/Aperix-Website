import { type Metadata } from "next";
import FeaturedMenu from "@/components/demos/hearthstone/FeaturedMenu";
import ReviewsStrip from "@/components/demos/hearthstone/ReviewsStrip";

export const metadata: Metadata = {
  title: "Menu — Hearthstone Café Fitzroy | Aperix Demo",
  description:
    "A Growth-tier menu page for Hearthstone Café, showing how a small business can present products clearly across dedicated pages.",
};

export default function HearthstoneMenuPage() {
  return (
    <main>
      <section className="bg-[#1c1612] px-6 py-16 text-center lg:py-20">
        <p className="font-(family-name:--font-hs-mono) text-xs font-semibold uppercase tracking-[0.24em] text-[#e8c547]">
          Menu
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-(family-name:--font-hs-display) text-4xl font-bold text-white md:text-5xl">
          Seasonal café favourites, easy to scan before you visit.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-(family-name:--font-hs-body) text-base leading-relaxed text-white/70">
          This dedicated page represents the extra structure included in the Growth tier: clear navigation, stronger content depth, and room for SEO-focused service or product pages.
        </p>
      </section>
      <FeaturedMenu />
      <ReviewsStrip />
    </main>
  );
}
