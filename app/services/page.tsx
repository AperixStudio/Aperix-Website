import type { Metadata } from "next";
import BubbleNav from "@/components/agency/BubbleNav";
import Footer from "@/components/agency/Footer";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Services | Aperix Studio",
  description: "Aperix Studio's services, packages, and pricing — coming soon.",
  path: "/services",
});

// Placeholder — design pending. Floating logo (SiteLogoFixed, layout.tsx)
// and the TABS pill (BubbleNav) are the only chrome kept in place while this
// gets designed.
export default function ServicesPage() {
  return (
    <>
      <main
        id="main-content"
        className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-agency-muted">
          Services
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold text-agency-ink sm:text-4xl">
          Coming soon.
        </h1>
      </main>

      <Footer />

      <BubbleNav />
    </>
  );
}
