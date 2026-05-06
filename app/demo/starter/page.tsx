import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Hearthstone Café Fitzroy — Demo | Aperix Studio",
  description: "Demo Growth-tier multi-page site for Hearthstone Café, an independent café in Fitzroy, Melbourne.",
};

import HearthstoneHero from "@/components/demos/hearthstone/HearthstoneHero";
import AboutStrip from "@/components/demos/hearthstone/AboutStrip";
import FeaturedMenu from "@/components/demos/hearthstone/FeaturedMenu";
import AboutCafe from "@/components/demos/hearthstone/AboutCafe";
import ReviewsStrip from "@/components/demos/hearthstone/ReviewsStrip";
import LocationHours from "@/components/demos/hearthstone/LocationHours";

export default function StarterDemoPage() {
  return (
    <main>
      <HearthstoneHero />
      <AboutStrip />
      <FeaturedMenu />
      <AboutCafe />
      <ReviewsStrip />
      <LocationHours />
    </main>
  );
}
