import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import SiteAtmosphere from "@/components/agency/SiteAtmosphere";
import CursorFollower from "@/components/animations/CursorFollower";
import IntroScreen from "@/components/animations/IntroScreen";
import PageReveal from "@/components/animations/PageReveal";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const themeInitScript = `
  (() => {
    try {
      const stored = window.localStorage.getItem("aperix-theme");
      const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const theme = stored === "dark" || stored === "light" ? stored : system;
      document.documentElement.dataset.theme = theme;
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  })();
`;

// Runs synchronously before React mounts — inserts a full-screen cover div
// that is completely outside the React tree so React cannot touch or remove it.
// IntroScreen's releaseIntroGate() removes it when the animation finishes.
const introCoverScript = `
  (function() {
    var cover = document.createElement('div');
    cover.id = 'aperix-intro-cover';
    cover.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:9998',
      'background:linear-gradient(135deg,#07070f 0%,#0a0a18 100%)',
      'pointer-events:all',
    ].join(';');
    document.body.appendChild(cover);
  })();
`;

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {/* 1. Theme — runs first, no flash */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* 2. Intro cover — physically inserts a full-screen div before React mounts.
               Outside the React tree so React cannot remove it during hydration.
               Removed by IntroScreen.releaseIntroGate() when the animation finishes. */}
        <script dangerouslySetInnerHTML={{ __html: introCoverScript }} />
        <IntroScreen />
        <SiteAtmosphere />
        <CursorFollower />
        {/* Netlify Forms: static form for build-time detection */}
        <form name="contact" data-netlify="true" netlify-honeypot="website" hidden>
          <input type="hidden" name="form-name" value="contact" />
          <input name="website" />
          <input name="name" />
          <input name="email" />
          <input name="phone" />
          <input name="businessName" />
          <input name="businessType" />
          <input name="needs" />
          <input name="tierInterest" />
          <input name="budgetRange" />
          <input name="timeline" />
          <input name="currentWebsite" />
          <input name="contactMethod" />
          <textarea name="description"></textarea>
        </form>
        <PageReveal>{children}</PageReveal>
      </body>
    </html>
  );
}
