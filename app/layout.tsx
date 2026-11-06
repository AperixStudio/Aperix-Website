import "@fontsource-variable/hubot-sans/wght.css";
import type { Metadata, Viewport } from "next";
import SiteAtmosphere from "@/components/agency/SiteAtmosphere";
import SiteBackground from "@/components/agency/SiteBackground";
import SiteLogoFixed from "@/components/agency/SiteLogoFixed";
import CursorFollower from "@/components/animations/CursorFollower";
import IntroSelector from "@/components/animations/IntroSelector";
import PageReveal from "@/components/animations/PageReveal";
import SkipToContent from "@/components/layout/SkipToContent";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/schema/siteSchema";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";
import { getSiteUrl } from "@/lib/site";
import { SITE_LOCALITY } from "@/lib/siteBusiness";
import "./globals.css";

const themeInitScript = `
  (() => {
    try {
      const stored = window.localStorage.getItem("aperix-theme");
      const theme = stored === "dark" || stored === "light" ? stored : "dark";
      document.documentElement.dataset.theme = theme;
    } catch {
      document.documentElement.dataset.theme = "dark";
    }
  })();
`;

const siteUrl = getSiteUrl();

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    buildOrganizationSchema({ includeGeo: true }),
    buildWebSiteSchema(),
  ],
};

const rootMetadata = buildPageMetadata({
  title: "Web Design & Software Studio Melbourne | Aperix Studio",
  socialTitle: "Aperix Studio",
  description:
    "Aperix Studio is a two-man Melbourne web design and software studio. We build custom websites for service-based and e-commerce businesses, plus apps and software.",
  path: "/",
});

export const metadata: Metadata = {
  ...rootMetadata,
  metadataBase: new URL(siteUrl),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1017" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={SITE_LOCALITY.htmlLang} data-theme="dark" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <noscript>
          <style>{`
            #aperix-intro-cover { display: none !important; }
            #aperix-page { opacity: 1 !important; visibility: visible !important; }
          `}</style>
        </noscript>
        <div
          id="aperix-intro-cover"
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "linear-gradient(135deg,#07070f 0%,#0a0a18 100%)",
            pointerEvents: "all",
          }}
        />
        <SkipToContent />
        {/* SiteLogoFixed lives outside PageReveal so it's always in the DOM
            and measurable — IntroScreenSimple reads its position to fly toward it. */}
        <SiteLogoFixed />
        <IntroSelector />
        <SiteBackground />
        <SiteAtmosphere />
        {/* SmoothScroll (custom wheel-hijack + rAF-driven scrollTo easing) is
            intentionally not mounted. It ran scroll position through main-
            thread JS instead of the browser's compositor thread, so any
            hitch elsewhere on the page — WebGL background frames, the video
            tiles' play/pause churn, framer-motion — stuttered the scroll
            itself rather than just a paint. Native scrolling (this file's
            `scroll-behavior: smooth` in globals.css covers anchor jumps) has
            no such failure mode. See components/animations/SmoothScroll.tsx
            if this needs revisiting. */}
        <CursorFollower />
        <PageReveal>{children}</PageReveal>
      </body>
    </html>
  );
}
