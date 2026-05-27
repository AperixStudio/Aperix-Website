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

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do I own my website after you build it?",
    answer:
      "Yes. You own the code, the design, and the domain once the project is complete. We can manage hosting and support, but the site is yours to keep or move.",
  },
  {
    question: "How long does a build take?",
    answer:
      "Basic sites usually take 3–7 business days once content is ready. Growth sites take about 2–3 weeks, Pro sites usually take 4–6 weeks, and Enterprise builds are scoped individually.",
  },
  {
    question: "What do I need to provide?",
    answer:
      "Usually your logo, any brand colours or references, photos if you have them, and the key details about your services. We handle the structure, design, and build.",
  },
  {
    question: "What’s included in the monthly retainer?",
    answer:
      "The care plans cover hosting, security updates, uptime monitoring, SSL, and general maintenance. Higher tiers can also include content changes, reporting, and faster support.",
  },
  {
    question: "Do you do WordPress?",
    answer:
      "Not for this kind of work. We build in Next.js for speed, structure, and maintainability, and we use Sanity CMS when editable content is needed.",
  },
  {
    question: "Can we meet in person in Melbourne?",
    answer:
      "Yes. We’re Melbourne-based and happy to meet in person if that’s easier. Most work happens remotely, but a face-to-face first meeting is always an option.",
  },
];