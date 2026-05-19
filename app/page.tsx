import SocialProofBar from "@/components/agency/SocialProofBar";
import HowItWorks from "@/components/agency/HowItWorks";
import TierShowcase from "@/components/agency/TierShowcase";
import LiveSitesSection from "@/components/agency/LiveSitesSection";
import FinalCTA from "@/components/agency/FinalCTA";
import Footer from "@/components/agency/Footer";
import HeroV2 from "@/components/agency/HeroV2";
import AgencyNavV2 from "@/components/agency/AgencyNavV2";

export default function Home() {
  return (
    <>
      <AgencyNavV2 />
      <HeroV2 />
      <main className="overflow-hidden">
        <div className="winding-section winding-section-left">
          <SocialProofBar />
        </div>
        <div className="winding-section winding-section-right">
          <HowItWorks />
        </div>
        <div className="winding-section winding-section-left">
          <TierShowcase />
        </div>
        <div className="winding-section winding-section-right">
          <LiveSitesSection />
        </div>
        <div className="winding-section winding-section-left">
          <FinalCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
