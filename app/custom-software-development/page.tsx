import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/agency/Footer";
import ServiceDetail from "@/components/agency/ServiceDetail";
import { caseStudyId } from "@/lib/liveSites";
import { buildServiceLandingSchema } from "@/lib/schema/siteSchema";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const title = "Custom software development | Aperix Studio";
const description =
  "Custom software development for a web app or a SaaS product people log into. The product and the path into setup are built as one piece.";

const faqs = [
  {
    question: "What should the first screen do?",
    answer:
      "Explain the product before the setup steps. POV Sync shows the synced view first, then the way in.",
  },
  {
    question: "Is this a normal marketing site?",
    answer:
      "No. A marketing site lives with the other service pages. This one is for software people log into.",
  },
  {
    question: "Will you start from a template?",
    answer: "No. The product and the setup path are written for the job.",
  },
  {
    question: "How do we start?",
    answer:
      "Use the contact page. Tell us what the software has to do and where people get stuck. We reply with a written scope.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/custom-software-development",
});

export default function CustomSoftwareDevelopmentPage() {
  return (
    <>
      <main id="main-content" className="overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildServiceLandingSchema({
                path: "/custom-software-development",
                name: title,
                description,
                serviceName: "Custom software development",
                faqs,
              }),
            ),
          }}
        />
        <ServiceDetail
          title="Custom software development"
          lede="Custom software development for a web app or a SaaS product people log into, not a brochure with a login attached."
          close="Describe what the software has to do, and where people get stuck today. We'll get in touch to talk through how we'd do it."
          sections={[
            {
              title: "The product",
              body: (
                <p className="offer__text">
                  Custom software development here means the product and the way into it
                  are one build. A technical workflow has to be clear before someone
                  reaches setup. It is not a theme with a login attached.
                </p>
              ),
            },
            {
              title: "How a build runs",
              body: (
                <>
                  <p className="offer__text">
                    You send a note with what you have. The first conversation is about
                    the customer, what is falling short, and what a good outcome looks
                    like. Pages, features, and timeline get written down before any code.
                  </p>
                  <p className="offer__text">
                    Then a sketch of the structure, the build, a private staging link,
                    feedback, and launch. The same two people stay on it through handover.
                  </p>
                </>
              ),
            },
            {
              title: "A product we have built",
              body: (
                <p className="offer__note">
                  <Link href={`/our-work#${caseStudyId("POV Sync")}`}>POV Sync</Link> is a
                  multi-POV streaming tool that puts YouTube and Twitch into one synced
                  view. The page answers what it is before how to use it. Onboarding stays
                  short, and the route into the host setup is easy to follow.
                </p>
              ),
            },
            {
              title: "Questions",
              body: (
                <>
                  <h3 className="offer__question">What should the first screen do?</h3>
                  <p className="offer__text">
                    Explain the product before the setup steps.{" "}
                    <Link href={`/our-work#${caseStudyId("POV Sync")}`}>POV Sync</Link> shows
                    the synced view first, then the way in.
                  </p>
                  <h3 className="offer__question">Is this a normal marketing site?</h3>
                  <p className="offer__text">
                    No. A marketing site lives with the other service pages. This one is for
                    software people log into.
                  </p>
                  <h3 className="offer__question">Will you start from a template?</h3>
                  <p className="offer__text">
                    No. The product and the setup path are written for the job.
                  </p>
                  <h3 className="offer__question">How do we start?</h3>
                  <p className="offer__text">
                    Use the <Link href="/contact">contact page</Link>. Tell us what the
                    software has to do and where people get stuck. We reply with a written
                    scope.
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
