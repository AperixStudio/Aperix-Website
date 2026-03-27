import { type Metadata } from "next";
import LuminaTreatmentsPage from "@/components/demos/premium/LuminaTreatmentsPage";

export const metadata: Metadata = {
  title: "Treatments — Lumina Med Spa | Demo",
  description: "Browse our full menu of medical aesthetic treatments in South Yarra.",
};

export default function TreatmentsRoute() {
  return <LuminaTreatmentsPage />;
}
