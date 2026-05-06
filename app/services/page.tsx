import AgencyNav from "@/components/agency/AgencyNav";
import Footer from "@/components/agency/Footer";
import ServiceHero from "@/components/agency/services/ServiceHero";
import TierDetails from "@/components/agency/services/TierDetails";
import AddOnTable from "@/components/agency/services/AddOnTable";
import ProjectTimeline from "@/components/agency/services/ProjectTimeline";
import Guarantee from "@/components/agency/services/Guarantee";
import FinalCTA from "@/components/agency/FinalCTA";

export const metadata = {
  title: "Services & Pricing | Aperix Studio",
  description:
    "Custom web development packages for Melbourne businesses. Compare Basic, Growth, Pro, and Enterprise tiers from $499 to $5,999+.",
};

export default function ServicesPage() {
  return (
    <>
      <AgencyNav />
      <main role="main">
        <ServiceHero />
        <TierDetails />
        <AddOnTable />
        <ProjectTimeline />
        <Guarantee />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
