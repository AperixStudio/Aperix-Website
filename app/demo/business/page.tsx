import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Apex Electrical Richmond — Demo | Aperix Studio",
  description: "Demo Pro-tier multi-page site for Apex Electrical, a licensed electrician in Richmond, Melbourne.",
};

import ApexHero from "@/components/demos/business/ApexHero";
import StatCounters from "@/components/demos/business/StatCounters";
import TrustBadges from "@/components/demos/business/TrustBadges";
import ServicesSnapshot from "@/components/demos/business/ServicesSnapshot";
import WhyChooseApex from "@/components/demos/business/WhyChooseApex";
import RecentProjects from "@/components/demos/business/RecentProjects";
import ApexReviews from "@/components/demos/business/ApexReviews";
import ApexCTA from "@/components/demos/business/ApexCTA";

/* ────────────────────────────────────────────────────────────
   /demo/business — PRD §8.3.2
  Apex Electrical — Pro tier ($3,290). Multi-page home.
   ──────────────────────────────────────────────────────────── */

export default function BusinessHomePage() {
  return (
    <>
      <ApexHero />
      <StatCounters />
      <TrustBadges />
      <ServicesSnapshot />
      <WhyChooseApex />
      <RecentProjects />
      <ApexReviews />
      <ApexCTA />
    </>
  );
}
