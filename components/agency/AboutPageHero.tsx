import Image from "next/image";
import Link from "next/link";
import { ABOUT_HERO_IMAGE_SRC } from "@/lib/aboutContent";
import "./AboutPageHero.css";

export default function AboutPageHero() {
  return (
    <section className="about-page-hero" aria-label="About Aperix Studio">
      <div className="about-page-hero__media">
        {ABOUT_HERO_IMAGE_SRC ? (
          <Image
            src={ABOUT_HERO_IMAGE_SRC}
            alt="Aperix Studio team — two developers building custom websites in Melbourne"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="about-page-hero__placeholder">
            <span className="about-page-hero__placeholder-label">Photo placeholder</span>
            <span>Drop your full-page about image at /public/about-hero.jpg</span>
            <span className="about-page-hero__placeholder-hint">
              Then set ABOUT_HERO_IMAGE_SRC to &quot;/about-hero.jpg&quot;
            </span>
          </div>
        )}
      </div>

      <div className="about-page-hero__overlay">
        <p className="about-page-hero__kicker">About us</p>
        <h1 className="about-page-hero__heading">Two developers. One studio.</h1>
        <p className="about-page-hero__lede">
          Aperix is a Melbourne web studio — hand-coding websites, web apps, and SaaS products for
          businesses that care about craft. Full story and team photo coming soon.
        </p>
        <Link href="/contact" className="about-page-hero__cta">
          Say hello
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
