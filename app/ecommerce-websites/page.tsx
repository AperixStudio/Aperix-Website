import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/agency/Footer";
import ServiceDetail from "@/components/agency/ServiceDetail";
import { caseStudyId } from "@/lib/liveSites";
import { buildServiceLandingSchema } from "@/lib/schema/siteSchema";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const title = "Ecommerce website design | Aperix Studio";
const description =
  "Ecommerce website design for a shop that should feel like the brand, not a generic catalogue. Ecommerce website development keeps the path from browsing to purchase short.";

const faqs = [
  {
    question: "What should the first screen do?",
    answer:
      "Carry the brand. The Hidden Chapter leads with the gift idea. The products are easy to find after that, not before the mood lands.",
  },
  {
    question: "How short is the path to buying?",
    answer:
      "Short enough to finish on a phone. The product journey stays tight so someone can go from curiosity to a purchase without digging.",
  },
  {
    question: "Will you start from a shop template?",
    answer: "No. The site is written for the shop.",
  },
  {
    question: "How do we start?",
    answer:
      "Use the contact page. Tell us what the shop sells and what it should feel like. We reply with a written scope.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/ecommerce-websites",
});

export default function EcommerceWebsitesPage() {
  return (
    <>
      <main id="main-content" className="overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildServiceLandingSchema({
                path: "/ecommerce-websites",
                name: title,
                description,
                serviceName: "Ecommerce website design",
                faqs,
              }),
            ),
          }}
        />
        <ServiceDetail
          title="Custom ecommerce websites"
          lede="Ecommerce website design for a shop that should feel like the brand, not a generic catalogue."
          close="Describe what the shop sells and what it should feel like. We'll get in touch to talk through how we'd do it."
          sections={[
            {
              title: "The shop",
              body: (
                <p className="offer__text">
                  Ecommerce website development here means a custom build. The story lands
                  first, the product pathways stay clear, and the path from browsing to
                  purchase stays short. It is not a theme with products dropped in.
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
              title: "A shop we have built",
              body: (
                <p className="offer__note">
                  <Link href={`/our-work#${caseStudyId("The Hidden Chapter")}`}>
                    The Hidden Chapter
                  </Link>{" "}
                  is a blind date with a book shop. The first scroll carries mood,
                  mystery, and gifting, instead of opening on a wall of products. The
                  product path stays short on a phone, so a visitor can move from
                  curiosity to browsing and then to a purchase.
                </p>
              ),
            },
            {
              title: "Questions",
              body: (
                <>
                  <h3 className="offer__question">What should the first screen do?</h3>
                  <p className="offer__text">
                    Carry the brand.{" "}
                    <Link href={`/our-work#${caseStudyId("The Hidden Chapter")}`}>
                      The Hidden Chapter
                    </Link>{" "}
                    leads with the gift idea. The products are easy to find after that,
                    not before the mood lands.
                  </p>
                  <h3 className="offer__question">How short is the path to buying?</h3>
                  <p className="offer__text">
                    Short enough to finish on a phone. The product journey stays tight so
                    someone can go from curiosity to a purchase without digging.
                  </p>
                  <h3 className="offer__question">Will you start from a shop template?</h3>
                  <p className="offer__text">No. The site is written for the shop.</p>
                  <h3 className="offer__question">How do we start?</h3>
                  <p className="offer__text">
                    Use the <Link href="/contact">contact page</Link>. Tell us what the
                    shop sells and what it should feel like. We reply with a written scope.
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
