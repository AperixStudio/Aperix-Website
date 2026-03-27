import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Apex Electrical | Demo",
  description: "Meet the Apex Electrical team. Richmond-based licensed electricians with 12+ years experience.",
};

import ApexAboutPage from "@/components/demos/business/ApexAboutPage";

/* ────────────────────────────────────────────────────────────
   /demo/business/about — PRD §8.3.4
   ──────────────────────────────────────────────────────────── */

export default function BusinessAboutRoute() {
  return <ApexAboutPage />;
}
