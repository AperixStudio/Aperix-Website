import { type Metadata } from "next";
import AgencyNav from "@/components/agency/AgencyNav";
import Footer from "@/components/agency/Footer";
import ContactForm from "@/components/agency/ContactForm";

/* ────────────────────────────────────────────────────────────
   /contact — PRD §10
   Two-column: dark left panel + form right panel
   ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Contact — Aperix Studio",
  description:
    "Get in contact with Aperix Studio about web development and social media management for your business in Melbourne.",
};

export default function ContactPage() {
  return (
    <>
      <AgencyNav />

      <main role="main" className="min-h-screen px-6 pt-28 pb-12 lg:pt-36">
        <div className="mx-auto grid max-w-6xl min-h-[80vh] overflow-hidden rounded-4xl border border-agency-border lg:grid-cols-[40%_60%]">
          {/* ── Left panel ─────────────────────────── */}
          <div className="flex flex-col justify-center bg-agency-surface px-8 py-16 lg:px-12 lg:py-20">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-accent">
              Get in Touch
            </p>
            <h2 className="font-display text-3xl font-bold text-agency-text sm:text-4xl">
              Let&apos;s talk about your business.
            </h2>
          </div>

          {/* ── Right panel — form ──────────────────── */}
          <div className="bg-agency-bg/65 backdrop-blur-sm">
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
