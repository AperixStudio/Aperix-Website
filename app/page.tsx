import SocialProofBar from "@/components/agency/SocialProofBar";
import HowItWorks from "@/components/agency/HowItWorks";
import TierShowcase from "@/components/agency/TierShowcase";
import DemoCustomizerSection from "@/components/agency/DemoCustomizerSection";
import LiveSitesSection from "@/components/agency/LiveSitesSection";
import TechnicalEdge from "@/components/agency/TechnicalEdge";
import FAQSection from "@/components/agency/FAQSection";
import Footer from "@/components/agency/Footer";
import HeroV2 from "@/components/agency/HeroV2";
import AgencyNavV2 from "@/components/agency/AgencyNavV2";
import CursorFollower from "@/components/animations/CursorFollower";
import { Shimmer } from "@/components/animations/Shimmer";

export default function Home() {
  const demoShimmerDuration = 1
  const previewCards = [
    { name: "Essential", price: "$499", features: 5 },
    { name: "Starter", price: "$1,290", features: 6 },
    { name: "Business", price: "$3,290", features: 8, popular: true },
    { name: "Premium", price: "$5,999+", features: 8 },
  ];

  return (
    <>
      <CursorFollower />
      <AgencyNavV2 />
      <HeroV2 />
      <SocialProofBar />
      <HowItWorks />
      <TierShowcase />
      <DemoCustomizerSection />
      <LiveSitesSection />
      <TechnicalEdge />
      <FAQSection />
      <Footer />
    </>
  );
}
