import { type Metadata } from "next";
import AboutStrip from "@/components/demos/hearthstone/AboutStrip";
import AboutCafe from "@/components/demos/hearthstone/AboutCafe";
import ReviewsStrip from "@/components/demos/hearthstone/ReviewsStrip";

export const metadata: Metadata = {
  title: "About — Hearthstone Café Fitzroy | Aperix Demo",
  description:
    "A Growth-tier about page for Hearthstone Café, giving the business room to build trust beyond a single homepage section.",
};

export default function HearthstoneAboutPage() {
  return (
    <main>
      <section className="bg-[#faf7f2] px-6 py-16 text-center lg:py-20">
        <p className="font-(family-name:--font-hs-mono) text-xs font-semibold uppercase tracking-[0.24em] text-[#8b5e3c]">
          About Hearthstone
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-(family-name:--font-hs-display) text-4xl font-bold text-[#1c1612] md:text-5xl">
          A warmer place for the story behind the café.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-(family-name:--font-hs-body) text-base leading-relaxed text-[#7a6a5f]">
          Growth-tier sites are still simple, but they are no longer cramped into one page. This page gives the brand story, team tone, and reviews room to breathe.
        </p>
      </section>
      <AboutStrip />
      <AboutCafe />
      <ReviewsStrip />
    </main>
  );
}
