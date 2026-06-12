import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import SiteAtmosphere from "@/components/agency/SiteAtmosphere";
import CursorFollower from "@/components/animations/CursorFollower";
import IntroScreen from "@/components/animations/IntroScreen";
import PageReveal from "@/components/animations/PageReveal";
import { getSiteUrl, SITE_SOCIAL_LINKS } from "@/lib/site";
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

// NOTE: The intro cover is now rendered as a JSX element below (with
// `suppressHydrationWarning`) so the server-rendered HTML matches the
// initial DOM. IntroScreen.releaseIntroGate() still removes it via direct
// DOM manipulation when the intro animation finishes. Previously we
// injected this div via an inline script which produced React error #418
// (HTML hydration mismatch) because React did not know about the node.

/* ── Agency Shell fonts (Section 3.2) ────────────────────── */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();
const siteLogoUrl = `${siteUrl}/aperix-logo.svg`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Aperix Studio",
      url: siteUrl,
      logo: siteLogoUrl,
      email: "hello@aperix.com.au",
      sameAs: SITE_SOCIAL_LINKS,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Aperix Studio",
      url: siteUrl,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Aperix Studio — Custom Web Development Melbourne",
  description:
    "Hand-coded, bespoke websites and social media management for Melbourne businesses. No templates. No WordPress. Just fast, modern, custom work.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aperix Studio — Custom Web Development Melbourne",
    description:
      "Hand-coded, bespoke websites and social media management for Melbourne businesses.",
    url: siteUrl,
    siteName: "Aperix Studio",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aperix Studio — Custom Web Development Melbourne",
    description:
      "Hand-coded, bespoke websites and social media management for Melbourne businesses.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* 1. Theme — runs first, no flash */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* 2. Intro cover — rendered server-side so the DOM matches the
               hydrated tree (avoids React error #418). IntroScreen removes
               it imperatively when the animation finishes. */}
        <div
          id="aperix-intro-cover"
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background:
              "linear-gradient(135deg,#07070f 0%,#0a0a18 100%)",
            pointerEvents: "all",
          }}
        />
        <IntroScreen />
        <SiteAtmosphere />
        <CursorFollower />
        <PageReveal>{children}</PageReveal>
      </body>
    </html>
  );
}
