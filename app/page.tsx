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

export default function Home() {
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
