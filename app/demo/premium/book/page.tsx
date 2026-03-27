import { type Metadata } from "next";
import LuminaBookingPage from "@/components/demos/premium/LuminaBookingPage";

export const metadata: Metadata = {
  title: "Book a Consultation — Lumina Med Spa | Demo",
  description: "Request a consultation at Lumina Med Spa, South Yarra. Two-step booking flow.",
};

export default function BookRoute() {
  return <LuminaBookingPage />;
}
