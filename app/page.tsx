import AgencyNav from "@/components/agency/AgencyNav";
import Hero from "@/components/agency/Hero";
import SocialProofBar from "@/components/agency/SocialProofBar";
import HowItWorks from "@/components/agency/HowItWorks";
import TierShowcase from "@/components/agency/TierShowcase";
import TechnicalEdge from "@/components/agency/TechnicalEdge";
import FAQSection from "@/components/agency/FAQSection";
import FinalCTA from "@/components/agency/FinalCTA";

export default function Home() {
  return (
    <>
      <AgencyNav />
      <Hero />
      <SocialProofBar />
      <HowItWorks />
      <TierShowcase />
      <TechnicalEdge />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
