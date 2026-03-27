import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Apex Electrical | Demo",
  description: "Electrical services for residential, commercial and emergency jobs across Melbourne inner east.",
};

import ApexServicesPage from "@/components/demos/business/ApexServicesPage";

/* ────────────────────────────────────────────────────────────
   /demo/business/services — PRD §8.3.3
   ──────────────────────────────────────────────────────────── */

export default function BusinessServicesRoute() {
  return <ApexServicesPage />;
}
