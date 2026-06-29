import type { Metadata, Viewport } from "next";
import SiteAtmosphere from "@/components/agency/SiteAtmosphere";
import SiteBackground from "@/components/agency/SiteBackground";
import CursorFollower from "@/components/animations/CursorFollower";
import IntroScreen from "@/components/animations/IntroScreen";
import PageReveal from "@/components/animations/PageReveal";
import SmoothScroll from "@/components/animations/SmoothScroll";
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
  title: "Aperix Studio — Custom Web Development Melbourne",
  description:
    "Hand-coded, bespoke websites and social media management for Melbourne businesses. No templates. No WordPress. Just fast, modern, custom work.",
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
        <IntroScreen />
        <SiteBackground />
        <SiteAtmosphere />
        <SmoothScroll />
        <CursorFollower />
        <PageReveal>{children}</PageReveal>
      </body>
    </html>
  );
}
