import { type Metadata } from "next";
import LuminaAboutPage from "@/components/demos/premium/LuminaAboutPage";

export const metadata: Metadata = {
  title: "About — Lumina Med Spa | Demo",
  description: "Meet the registered practitioners behind Lumina Med Spa, South Yarra.",
};

export default function AboutRoute() {
  return <LuminaAboutPage />;
}
