import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

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
    <html lang="en">
      <body
        className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
