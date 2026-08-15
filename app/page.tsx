import BubbleNav from "@/components/agency/BubbleNav";
import HomeHero from "@/components/agency/HomeHero";

// New look — build here.
// SiteLogoFixed is in layout.tsx (outside PageReveal).
// Reference the existing design at /current.

export default function Home() {
  return (
    <>
      <main id="main-content">
        <HomeHero />

        {/* ↓ build your new sections here */}
      </main>

      <BubbleNav />
    </>
  );
}
