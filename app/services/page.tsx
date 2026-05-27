import AgencyNav from "@/components/agency/AgencyNav";
import Footer from "@/components/agency/Footer";
import ServiceHero from "@/components/agency/services/ServiceHero";
import TierDetails from "@/components/agency/services/TierDetails";
import AddOnTable from "@/components/agency/services/AddOnTable";
import FAQSection from "@/components/agency/FAQSection";
import FinalCTA from "@/components/agency/FinalCTA";
import BackToTop from "@/components/agency/BackToTop";
import { getSiteUrl, SITE_EMAIL, SITE_LOGO_PATH, SITE_NAME, SITE_SOCIAL_LINKS } from "@/lib/site";
import { FAQ_ITEMS, SERVICE_TIERS } from "@/lib/services-content";

const siteUrl = getSiteUrl();
const siteLogoUrl = `${siteUrl}${SITE_LOGO_PATH}`;

const serviceSchema = SERVICE_TIERS.map((tier) => ({
  "@type": "Service",
  name: `${tier.name} Website`,
  description: tier.description,
  provider: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: siteUrl,
  },
  areaServed: {
    "@type": "City",
    name: "Melbourne",
  },
  offers: {
    "@type": "Offer",
    price: tier.price.replace(/[^\d.+]/g, ""),
    priceCurrency: "AUD",
    url: `${siteUrl}/services`,
  },
}));

const faqSchema = {
  "@type": "FAQPage",
  "@id": `${siteUrl}/services#faq`,
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: SITE_NAME,
      url: siteUrl,
      logo: siteLogoUrl,
      email: SITE_EMAIL,
      sameAs: SITE_SOCIAL_LINKS,
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/services#webpage`,
      url: `${siteUrl}/services`,
      name: "Services & Pricing | Aperix Studio",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
    },
    ...serviceSchema,
    faqSchema,
  ],
};

export const metadata = {
  title: "Services & Pricing | Aperix Studio",
  description:
    "Custom web development packages for Melbourne businesses. Compare Basic, Growth, Pro, and Enterprise tiers from $499 to $5,999+.",
  alternates: {
    canonical: `${siteUrl}/services`,
  },
  openGraph: {
    title: "Services & Pricing | Aperix Studio",
    description:
      "Custom web development packages for Melbourne businesses. Compare Basic, Growth, Pro, and Enterprise tiers from $499 to $5,999+.",
    url: `${siteUrl}/services`,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services & Pricing | Aperix Studio",
    description:
      "Custom web development packages for Melbourne businesses. Compare Basic, Growth, Pro, and Enterprise tiers from $499 to $5,999+.",
  },
};

export default function ServicesPage() {
  return (
    <>
      <AgencyNav />
      <main role="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
