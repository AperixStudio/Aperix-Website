import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/agency/Footer";
import ServiceDetail from "@/components/agency/ServiceDetail";
import { caseStudyId } from "@/lib/liveSites";
import { buildServiceLandingSchema } from "@/lib/schema/siteSchema";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const title = "Web design for tradies | Aperix Studio";
const description =
  "Web design for tradies. The work and the quote path sit up front, so an enquiry is easy to send. One site covers the business.";

const faqs = [
  {
    question: "Do you build a separate page for each trade?",
    answer:
      "No. Complete Trade Solutions puts several trades on one site, grouped so it still reads as one team.",
  },
  {
    question: "What has to be on the first screen?",
    answer:
      "The work, and a way to enquire. National Roofing Solutions puts trust and contact up front. Complete Trade Solutions keeps the quote path easy to find.",
  },
  {
    question: "How do we start?",
    answer:
      "Use the contact page. Tell us the work you do and what the current site fails at. We reply with a written scope.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/web-design-for-tradies",
});

export default function WebDesignForTradiesPage() {
  return (
    <>
      <main id="main-content" className="overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildServiceLandingSchema({
                path: "/web-design-for-tradies",
                name: title,
                description,
                serviceName: "Web design for tradies",
                faqs,
              }),
            ),
          }}
        />
        <ServiceDetail
          title="Websites for Tradies"
          lede="Web design for tradies who need enquiries, not a brochure. The work is on the first screen, and the way to ask for a quote is easy to find."
          close="Describe the work you want the site to bring in. We'll get in touch to talk through how we'd do it."
          sections={[
            {
              title: "The job of the site",
              body: (
                <p className="offer__text">
                  The site helps someone who already needs the work done to trust the
                  business and send an enquiry. One site covers the business. It does not
                  split into a page per trade, or a page per suburb.
                </p>
              ),
            },
            {
              title: "How a build runs",
              body: (
                <>
                  <p className="offer__text">
                    You send a note with what you have. The first conversation is about the
                    customer, what is falling short, and what a good outcome looks like.
                    Pages, features, and timeline get written down before any code.
                  </p>
                  <p className="offer__text">
                    Then a sketch of the structure, the build, a private staging link,
                    feedback, and launch. The same two people stay on it through handover.
                  </p>
                </>
              ),
            },
            {
              title: "Trade sites we have built",
              body: (
                <>
                  <p className="offer__note">
                    <Link href={`/our-work#${caseStudyId("Complete Trade Solutions")}`}>
                      Complete Trade Solutions
                    </Link>{" "}
                    covers kitchen renovations, roof restoration, painting, plumbing,
                    electrical, cabinetry, and flooring. The services are grouped so the
                    page stays scannable, and the quote path stays visible. Most visitors
                    already know they need the work. They need to find their service and
                    enquire.
                  </p>
                  <p className="offer__note">
                    <Link href={`/our-work#${caseStudyId("National Roofing Solutions")}`}>
                      National Roofing Solutions
                    </Link>{" "}
                    is a roofing contractor in Sunbury. Repairs, restorations, and
                    replacements sit in the hero, trust signals are on the first screen,
                    and the contact path is for someone who needs a roofer now.
                  </p>
                </>
              ),
            },
            {
              title: "Questions",
              body: (
                <>
                  <h3 className="offer__question">Do you build a separate page for each trade?</h3>
                  <p className="offer__text">
                    No.{" "}
                    <Link href={`/our-work#${caseStudyId("Complete Trade Solutions")}`}>
                      Complete Trade Solutions
                    </Link>{" "}
                    puts several trades on one site, grouped so it still reads as one team.
                  </p>
                  <h3 className="offer__question">What has to be on the first screen?</h3>
                  <p className="offer__text">
                    The work, and a way to enquire. National Roofing Solutions puts trust and
                    contact up front. Complete Trade Solutions keeps the quote path easy to
                    find.
                  </p>
                  <h3 className="offer__question">How do we start?</h3>
                  <p className="offer__text">
                    Use the <Link href="/contact">contact page</Link>. Tell us the work you
                    do and what the current site fails at. We reply with a written scope.
                  </p>
                </>
              ),
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
