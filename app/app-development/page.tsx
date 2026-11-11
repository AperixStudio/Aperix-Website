import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/agency/Footer";
import ServiceDetail from "@/components/agency/ServiceDetail";
import { caseStudyId } from "@/lib/liveSites";
import { buildServiceLandingSchema } from "@/lib/schema/siteSchema";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const title = "App development | Aperix Studio";
const description =
  "App development for a product people use on the phone. Scoring, the course, and the weekend can live in one app.";

const faqs = [
  {
    question: "What should the first screen do?",
    answer:
      "Show the job the app is for. Mully opens on the round: scoring, the hole, and the people in it.",
  },
  {
    question: "Is this a phone version of a website?",
    answer:
      "No. App development here is the product itself. The phone app stays on its own stack, with the course data, accounts, and live updates behind it.",
  },
  {
    question: "Is there a public store listing?",
    answer: "Not yet. A demo is available on request.",
  },
  {
    question: "How do we start?",
    answer:
      "Use the contact page. Tell us what the app has to do and where the work is split across other tools today. We reply with a written scope.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/app-development",
});

export default function AppDevelopmentPage() {
  return (
    <>
      <main id="main-content" className="overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildServiceLandingSchema({
                path: "/app-development",
                name: title,
                description,
                serviceName: "App development",
                faqs,
              }),
            ),
          }}
        />
        <ServiceDetail
          title="App development"
          lede="App development for a product people carry with them. The app does the job, instead of sending them between a scorecard, a map, and a chat."
          close="Describe what the app has to do. We'll get in touch to talk through how we'd do it."
          sections={[
            {
              title: "The product",
              body: (
                <p className="offer__text">
                  App development here means the thing in someone&apos;s hand: the task,
                  the people, and the data that task needs. It is not a brochure squeezed
                  onto a phone.
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
              title: "An app we have built",
              body: (
                <p className="offer__note">
                  <Link href={`/our-work#${caseStudyId("Mully")}`}>Mully</Link> is a golf
                  app for a group that wants the round, the map, and the weekend in one
                  place. It has hole-by-hole scoring, a course map with distances, friends
                  and messages, and multi-day events with a live snake draft. There is no
                  public store listing yet. A demo is available on request.
                </p>
              ),
            },
            {
              title: "Questions",
              body: (
                <>
                  <h3 className="offer__question">What should the first screen do?</h3>
                  <p className="offer__text">
                    Show the job the app is for.{" "}
                    <Link href={`/our-work#${caseStudyId("Mully")}`}>Mully</Link> opens on
                    the round: scoring, the hole, and the people in it.
                  </p>
                  <h3 className="offer__question">Is this a phone version of a website?</h3>
                  <p className="offer__text">
                    No. App development here is the product itself. The phone app stays on
                    its own stack, with the course data, accounts, and live updates behind
                    it.
                  </p>
                  <h3 className="offer__question">Is there a public store listing?</h3>
                  <p className="offer__text">Not yet. A demo is available on request.</p>
                  <h3 className="offer__question">How do we start?</h3>
                  <p className="offer__text">
                    Use the <Link href="/contact">contact page</Link>. Tell us what the app
                    has to do and where the work is split across other tools today. We
                    reply with a written scope.
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
