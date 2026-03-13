import AgencyNav from "@/components/agency/AgencyNav";
import Footer from "@/components/agency/Footer";
import ServiceHero from "@/components/agency/services/ServiceHero";
import TierDetails from "@/components/agency/services/TierDetails";
import AddOnTable from "@/components/agency/services/AddOnTable";
import ProjectTimeline from "@/components/agency/services/ProjectTimeline";
import Guarantee from "@/components/agency/services/Guarantee";

export const metadata = {
  title: "Services & Pricing | Aperix Studio",
  description:
    "Custom web development packages for Melbourne businesses. Transparent pricing from $499 to $3,999+. All sites score 100/100 on Lighthouse.",
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
      </main>
      <Footer />
    </>
  );
}
