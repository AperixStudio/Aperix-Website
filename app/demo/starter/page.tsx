import HearthstoneNav from "@/components/demos/hearthstone/HearthstoneNav";
import HearthstoneHero from "@/components/demos/hearthstone/HearthstoneHero";
import AboutStrip from "@/components/demos/hearthstone/AboutStrip";
import FeaturedMenu from "@/components/demos/hearthstone/FeaturedMenu";
import AboutCafe from "@/components/demos/hearthstone/AboutCafe";
import ReviewsStrip from "@/components/demos/hearthstone/ReviewsStrip";
import LocationHours from "@/components/demos/hearthstone/LocationHours";
import HearthstoneFooter from "@/components/demos/hearthstone/HearthstoneFooter";

export default function StarterDemoPage() {
  return (
    <>
      <HearthstoneNav />
      <main>
        <HearthstoneHero />
        <AboutStrip />
        <FeaturedMenu />
        <AboutCafe />
        <ReviewsStrip />
        <LocationHours />
      </main>
      <HearthstoneFooter />
    </>
  );
}
