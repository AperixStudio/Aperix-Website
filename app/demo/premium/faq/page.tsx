import { type Metadata } from "next";
import LuminaFAQPage from "@/components/demos/premium/LuminaFAQPage";

export const metadata: Metadata = {
  title: "FAQ — Lumina Med Spa | Demo",
  description: "Frequently asked questions about treatments, safety, and booking at Lumina Med Spa.",
};

export default function FAQRoute() {
  return <LuminaFAQPage />;
}
