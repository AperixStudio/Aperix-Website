import type { Metadata } from "next";
import BubbleNav from "@/components/agency/BubbleNav";
import Footer from "@/components/agency/Footer";
import ForumInbox from "@/components/agency/ForumInbox";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Forum | Aperix Studio",
  description: "Build notes and write-ups from Aperix Studio.",
  path: "/forum",
});

export default function ForumPage() {
  return (
    <>
      <main
        id="main-content"
        className="relative z-10 flex min-h-dvh flex-col pt-38 pb-16 sm:pt-42"
      >
        <ForumInbox />
      </main>

      <Footer />

      <BubbleNav />
    </>
  );
}
