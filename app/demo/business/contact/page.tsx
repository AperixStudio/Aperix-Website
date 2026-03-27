import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Apex Electrical | Demo",
  description: "Request a free electrical quote from Apex Electrical, Richmond. Same-day callouts available.",
};

import ApexContactPage from "@/components/demos/business/ApexContactPage";

/* ────────────────────────────────────────────────────────────
   /demo/business/contact — PRD §8.3.5
   ──────────────────────────────────────────────────────────── */

export default function BusinessContactRoute() {
  return <ApexContactPage />;
}
