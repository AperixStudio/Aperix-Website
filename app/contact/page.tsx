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
    "Book a free 20-minute discovery call with Aperix Studio. Melbourne web development and social media management for small businesses.",
};

export default function ContactPage() {
  return (
    <>
      <AgencyNav />

      <main role="main" className="min-h-screen bg-agency-bg pt-16">
        <div className="mx-auto grid max-w-6xl min-h-[80vh] lg:grid-cols-[40%_60%]">
          {/* ── Left panel ─────────────────────────── */}
          <div className="flex flex-col justify-center bg-agency-surface px-8 py-16 lg:px-12 lg:py-20">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-agency-accent">
              Get in Touch
            </p>
            <h2 className="font-display text-3xl font-bold text-agency-text sm:text-4xl">
              Let&apos;s talk about your business.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-agency-muted">
              Book a free 20-minute discovery call and I&apos;ll show you
              exactly what&apos;s possible for your business online. No sales
              pitch — just honest conversation.
            </p>

            {/* Contact details */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-agency-muted">
                <span aria-hidden="true">📧</span>
                <a
                  href="mailto:hello@aperix.com.au"
                  className="transition-colors hover:text-agency-text"
                >
                  hello@aperix.com.au
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-agency-muted">
                <span aria-hidden="true">📍</span>
                <span>Melbourne, VIC — available for in-person meetings</span>
              </div>
            </div>

            {/* What happens next */}
            <div className="mt-10">
              <p className="mb-4 text-sm font-medium text-agency-text">
                What happens next?
              </p>
              <ol className="space-y-3">
                {[
                  "I review your current online presence before the call",
                  "We discuss your goals — I show you relevant demo sites",
                  "I follow up with a proposal within 48 hours",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-agency-muted">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-agency-accent/10 text-xs font-bold text-agency-accent">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Response badge */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-agency-border bg-agency-surface2 px-4 py-2 text-xs text-agency-muted">
              <span aria-hidden="true">⚡</span>
              Typically responds within 24 hours
            </div>
          </div>

          {/* ── Right panel — form ──────────────────── */}
          <div className="bg-agency-bg">
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
