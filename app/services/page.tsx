import type { Metadata } from "next";
import AgencyNavV2 from "@/components/agency/AgencyNavV2";
import Footer from "@/components/agency/Footer";
import ServiceHero from "@/components/agency/services/ServiceHero";
import TierDetails from "@/components/agency/services/TierDetails";
import AddOnTable from "@/components/agency/services/AddOnTable";
import FAQSection from "@/components/agency/FAQSection";
import FinalCTA from "@/components/agency/FinalCTA";
import BackToTop from "@/components/agency/BackToTop";
import { buildOrganizationSchema } from "@/lib/schema/siteSchema";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";
import { getSiteUrl } from "@/lib/site";
import { FAQ_ITEMS, SERVICE_TIERS } from "@/lib/services-content";

const siteUrl = getSiteUrl();

function buildTierOffer(priceLabel: string) {
  const numeric = priceLabel.replace(/[^\d.]/g, "");

  if (priceLabel.includes("+") && numeric) {
    return {
      "@type": "Offer" as const,
      priceCurrency: "AUD",
      priceSpecification: {
        "@type": "UnitPriceSpecification" as const,
        minPrice: numeric,
        priceCurrency: "AUD",
      },
      url: `${siteUrl}/services`,
    };
  }

  return {
    "@type": "Offer" as const,
    price: numeric,
    priceCurrency: "AUD",
    url: `${siteUrl}/services`,
  };
}

const serviceSchema = SERVICE_TIERS.map((tier) => ({
  "@type": "Service" as const,
  name: `${tier.name} Website`,
  description: tier.description,
  provider: {
    "@id": `${siteUrl}/#organization`,
  },
  areaServed: {
    "@type": "City" as const,
    name: "Melbourne",
  },
  offers: buildTierOffer(tier.price),
}));

const faqSchema = {
  "@type": "FAQPage" as const,
  "@id": `${siteUrl}/services#faq`,
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question" as const,
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: item.answer,
    },
  })),
};

const servicesPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    buildOrganizationSchema({ includeGeo: true }),
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/services#webpage`,
      url: `${siteUrl}/services`,
      name: "Services & Pricing | Aperix Studio",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    ...serviceSchema,
    faqSchema,
  ],
};

export const metadata: Metadata = buildPageMetadata({
  title: "Services & Pricing | Aperix Studio",
  description:
    "Custom web development packages for Melbourne businesses. Compare Basic, Growth, Pro, and Enterprise tiers from $499 to $5,999+.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <AgencyNavV2 />
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageSchema) }}
        />
        <ServiceHero />
        <TierDetails />
        <AddOnTable />
        <FAQSection />
        <FinalCTA />
        <BackToTop />
      </main>
      <Footer />
    </>
  );
}
