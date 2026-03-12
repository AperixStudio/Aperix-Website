import AgencyNav from "@/components/agency/AgencyNav";
import Hero from "@/components/agency/Hero";
import SocialProofBar from "@/components/agency/SocialProofBar";
import HowItWorks from "@/components/agency/HowItWorks";
import TierShowcase from "@/components/agency/TierShowcase";
import TechnicalEdge from "@/components/agency/TechnicalEdge";

export default function Home() {
  return (
    <>
      <AgencyNav />
      <Hero />
      <SocialProofBar />
      <HowItWorks />
      <TierShowcase />
      <TechnicalEdge />
    </>
  );
}
