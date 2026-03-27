import { type Metadata } from "next";
import LuminaHome from "@/components/demos/premium/LuminaHome";

export const metadata: Metadata = {
  title: "Lumina Med Spa — South Yarra | Aperix Demo",
  description:
    "Premium medical aesthetics clinic in South Yarra. Natural results, registered practitioners.",
};

export default function PremiumHomePage() {
  return <LuminaHome />;
}
