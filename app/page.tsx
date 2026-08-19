import BubbleNav from "@/components/agency/BubbleNav";
import Footer from "@/components/agency/Footer";
import HomeAboutSection from "@/components/agency/HomeAboutSection";
import HomeWorkAboutBand from "@/components/agency/HomeWorkAboutBand";
import HomeContactSection from "@/components/agency/HomeContactSection";
import HomeHero from "@/components/agency/HomeHero";
import HomeWorkSection from "@/components/agency/HomeWorkSection";
import "./home-fit.css";

// New look — build here.
// SiteLogoFixed is in layout.tsx (outside PageReveal).
// Reference the existing design at /current.

export default function Home() {
  return (
    <>
      <main id="main-content" className="home-page">
        <HomeHero />
        <HomeWorkAboutBand
          work={<HomeWorkSection />}
          about={<HomeAboutSection />}
        />
        <HomeContactSection />
      </main>

      <Footer />

      <BubbleNav />
    </>
  );
}
