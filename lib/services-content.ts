import { RECEPTIONIST_LINE } from "@/lib/siteBusiness";

export type TierTone = "muted" | "cyan" | "amber" | "violet";

export type ServiceTierContent = {
  name: string;
  badge: TierTone;
  price: string;
  summary: string;
  homepageFeatures: string[];
  description: string;
  features: string[];
  notIncluded: string[];
  timeline: string;
  retainer: string;
  previousTier?: string;
  popular?: boolean;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const SERVICE_TIERS: ServiceTierContent[] = [
  {
    name: "Basic",
    badge: "muted",
    summary: "Get online fast with a single-page site that gives your business a clear, credible presence.",
    homepageFeatures: [
      "Single page - your choosing of what to present",
      "Fully responsive and mobile friendly",
      "Contact form with email notification",
    ],
    description:
      "Best for new businesses and solo operators who need a polished single-page website quickly. Includes strategy, custom design, development, mobile optimisation, and launch support in about 3–7 business days. Ideal if you want a strong online presence without overcomplicating the build.",
    price: "$499",
    features: [
      "Single page - your choosing of what to present",
      "Fully responsive and mobile friendly",
      "Contact form with email notification",
      "Basic on-page SEO (meta tags, page titles, structured data)",
      "Hosted by Aperix and their chosen providers - transferable to your own hosting any time",
    ],
    notIncluded: [
      "Multi-page navigation",
      "CMS / content editing",
      "Custom design system",
      "Booking or payment integrations",
      "SEO strategy or ongoing optimisation",
    ],
    timeline: "Typically 3-7 business days plus time for feedback and revisions",
    retainer: "From $50/month Basic Care",
  },
  {
    name: "Growth",
    badge: "cyan",
    summary: "A clean multi-page website for businesses that need room to explain their services and build trust.",
    homepageFeatures: [
      "Everything in Basic, PLUS:",
      "4-5 custom-coded pages with your choice of content",
      "Google Business Profile setup & optimisation",
    ],
    description:
      "Best for service businesses that need space to explain what they do, show proof, and generate enquiries. Includes 4–5 custom pages, tailored copy structure, enquiry forms, responsive design, and launch support in around 2–3 weeks. A good fit if you want more trust, more clarity, and better search visibility.",
    price: "$1,290",
    features: [
      "Everything in Basic, PLUS:",
      "4-5 custom-coded pages with your choice of content",
      "Google Business Profile setup & optimisation",
    ],
    notIncluded: [
      "CMS / content editing panel",
      "Booking or payment integrations",
      "Advanced SEO strategy",
      "Brand identity or logo design",
      "Custom animations beyond standard transitions",
    ],
    timeline: "Typically 2-3 weeks plus time for feedback and revisions",
    retainer: "From $100/month Pro Care",
  },
  {
    name: "Pro",
    badge: "amber",
    summary: "A stronger custom site for businesses that need better structure, content control, and enquiry flow.",
    homepageFeatures: [
      "Everything in Growth, PLUS:",
      "6-10 custom-coded pages",
      "Content Management System integration - edit your own content",
    ],
    description:
      "Best for established businesses that need a more strategic website with deeper content and stronger conversion flow. Includes 6–10 custom pages, refined user journeys, schema, stronger SEO foundations, and ongoing support after launch. Usually delivered in 4–6 weeks and designed to improve leads, clarity, and credibility.",
    price: "$3,290",
    features: [
      "Everything in Growth, PLUS:",
      "6-10 custom-coded pages",
      "Content Management System integration - edit your own content",
      "Google Analytics + Search Console setup",
      "Performance-focused build with Core Web Vitals in mind",
      "2 rounds of revisions included",
    ],
    notIncluded: [
      "Unlimited pages or unlimited revisions",
      "E-commerce / online store",
      "Brand identity or logo design",
      "Custom portals or login areas",
      "Ongoing SEO retainer (available as add-on)",
    ],
    timeline: "Typically 4-6 weeks plus time for feedback and revisions",
    retainer: "From $100/month Pro Care",
    popular: true,
    previousTier: "Growth",
  },
  {
    name: "Enterprise",
    badge: "violet",
    summary: "A bespoke build for businesses that need a more considered brand experience and deeper functionality.",
    homepageFeatures: [
      "Everything in Pro, PLUS:",
      "Unlimited pages, full custom architecture",
      "Brand identity consultation included",
    ],
    description:
      "Best for larger businesses or brands that need a fully bespoke website with advanced functionality, deeper content structure, and a premium brand experience. Includes custom architecture, tailored integrations, scalable build planning, and dedicated support. Timeline is scoped individually, and the outcome is a website built to grow with the business.",
    price: "$5,999+",
    features: [
      "Everything in Pro, PLUS:",
      "Unlimited pages, full custom architecture",
      "Brand identity consultation included",
      "Advanced animations & interactions",
      "Headless CMS with full content model",
      "Custom integrations (booking, payments, portals)",
      "Advanced SEO strategy + schema markup",
      "Performance report on delivery",
      "Priority support, 3 months included post-launch",
    ],
    notIncluded: [
      "Ongoing paid advertising management (available as add-on)",
      "Photography or videography production",
      "App development (iOS / Android)",
      "Print design or physical branding materials",
    ],
    timeline: "Scoped individually, typically 6-10 weeks plus time for feedback and revisions",
    retainer: "From $200/month Enterprise Care",
    previousTier: "Pro",
  },
];

export type ServicePageLink = {
  before: string;
  label: string;
  href: `/${string}`;
  after: string;
};

export type ServiceCall = {
  /** tel: href for the live receptionist. */
  href: string;
  /** Number as it should be read on the page. */
  number: string;
};

export type ServiceCaseStudy = {
  /** Text immediately before the project link. */
  before: string;
  /** Project name. The link text, and the `/our-work` anchor. */
  name: string;
  /** Text immediately after the project link. */
  after: string;
};

export type StudioService = {
  id: string;
  name: string;
  summary: string;
  /** Short lines under the summary. Add or remove freely. */
  covers: string[];
  /** Case studies linked from this section. Omitted when the catalogue has none. */
  caseStudies?: ServiceCaseStudy[];
  /** When set, the service name dials this number. */
  call?: ServiceCall;
  /** Dedicated pages this section introduces. */
  pages?: ServicePageLink[];
};

/**
 * Services shown on /services, in display order.
 * Add another object to this list and it appears on the page.
 * Numbering is automatic.
 */
export const STUDIO_SERVICES: StudioService[] = [
  {
    id: "web-design",
    name: "Web design",
    summary:
      "Hand-coded websites for service businesses, shops, and brands that need a site with a point of view. No templates, and no WordPress.",
    covers: ["Service businesses", "E-commerce", "Landing pages"],
    caseStudies: [
      { before: "See ", name: "Nails by Avy", after: ", and " },
      { before: "", name: "The Hidden Chapter", after: " for the shop." },
    ],
    pages: [
      { before: "More on ", label: "ecommerce websites", href: "/ecommerce-websites", after: " and " },
      { before: "", label: "websites for tradies", href: "/web-design-for-tradies", after: "." },
    ],
  },
  {
    id: "web-apps",
    name: "Web apps & SaaS",
    summary:
      "Products people log into. The site, the onboarding, and the product itself, built as one piece rather than a theme with a login attached.",
    covers: ["SaaS products", "Onboarding", "Dashboards"],
    caseStudies: [{ before: "See ", name: "POV Sync", after: "." }],
  },
  {
    id: "software",
    name: "Software development",
    summary:
      "Bespoke software for the way a business actually runs. Tools, portals, and the work a marketing site was never meant to carry.",
    covers: ["Custom software", "Internal tools", "Client portals"],
    caseStudies: [{ before: "See ", name: "POV Sync", after: " for the product build." }],
    pages: [
      {
        before: "More on ",
        label: "custom software development",
        href: "/custom-software-development",
        after: ".",
      },
    ],
  },
  {
    id: "apps",
    name: "App development",
    summary:
      "Apps for the phone and for the product. The same two people from the first conversation through to something you can hand someone.",
    covers: ["Mobile apps", "Product apps"],
    caseStudies: [{ before: "See ", name: "Mully", after: "." }],
    pages: [
      {
        before: "More on ",
        label: "app development",
        href: "/app-development",
        after: ".",
      },
    ],
  },
  {
    id: "ai-receptionist",
    name: "AI receptionist",
    summary:
      "A receptionist on the business phone line. It answers as the main call taker, or in place of the answering machine. It sounds like a person, collects the caller's name, contact details, job type, and when the work is needed, and can book an appointment or inspection against the rest of the calendar. It is an AI receptionist for tradies, and the same setup fits salons and other service businesses.",
    covers: ["Trades", "Salons", "Bookings"],
    call: {
      href: `tel:${RECEPTIONIST_LINE.tel}`,
      number: RECEPTIONIST_LINE.display,
    },
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do I own my website after you build it?",
    answer:
      "Yes. You own the code, the design, and the domain once the project is complete. We can manage hosting and support, but the site is yours to keep or move at any time.",
  },
  {
    question: "How long does a project take?",
    answer:
      "It depends on scope. A focused website might take a few weeks once content is ready; builds with custom features, integrations, or a CMS usually take longer. When you get in touch, we'll reply with a clear timeline, not a vague package estimate.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Every project is scoped individually. We look at what you need, from pages and functionality to content structure and timeline, then send back a fixed quote with the next steps. Tell us what you're trying to achieve through the contact form and we'll shape the rest from there.",
  },
  {
    question: "What do I need to provide?",
    answer:
      "Usually your logo, any brand colours or references, photos if you have them, and the key details about your services or product. We handle the structure, design, and build. If you're not sure where to start, describe the outcome you want and we'll help fill in the gaps.",
  },
  {
    question: "What kind of work do you take on?",
    answer:
      "Custom websites, web apps, and SaaS products, from landing pages and multi-service business sites to e-commerce, campaign pages, and software builds. We're a two-person team in Melbourne and work on projects of different sizes, as long as they're worth doing properly.",
  },
  {
    question: "Do you use WordPress?",
    answer:
      "Not for this kind of work. You get a fully custom site instead of a template, so there's no limit on what we can build together.",
  },
  {
    question: "Can we meet in person in Melbourne?",
    answer:
      "Yes. We're Melbourne-based and happy to meet face-to-face if that's easier. Most work happens remotely, but an in-person kick-off is always an option.",
  },
  {
    question: "Do you work with clients outside Melbourne?",
    answer:
      "Yes. We're based in Melbourne but work with clients across Australia and internationally. Video calls work fine for briefs, reviews, and handover.",
  },
];