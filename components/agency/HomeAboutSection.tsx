import Image from "next/image";
import { ABOUT_TEAM_PANEL_PHOTOS } from "@/lib/aboutContent";
import "./HomeAboutSection.css";

/** About us — the two team photos from /current About panel 03, plus the studio blurb. */
export default function HomeAboutSection() {
  const { left, right } = ABOUT_TEAM_PANEL_PHOTOS;

  return (
    <section id="about" className="home-about" aria-labelledby="home-about-heading">
      <div className="home-about__inner">
        <div className="home-about__photos">
          <div className="home-about__photo home-about__photo--left">
            <Image src={left.src} alt={left.alt} fill sizes="(max-width: 860px) 46vw, 26vw" />
          </div>
          <div className="home-about__photo home-about__photo--right">
            <Image src={right.src} alt={right.alt} fill sizes="(max-width: 860px) 46vw, 26vw" />
          </div>
        </div>

        <div className="home-about__copy">
          <p className="home-about__eyebrow">About us</p>
          <h2 id="home-about-heading" className="home-about__heading">
            The team behind the pixels,
          </h2>
          <p className="home-about__lede">
            just a small 2 man team based in Melbourne, who have completed many projects
            ranging from app and software development through to web design and more, wanting
            to turn your ideas into a reality
          </p>

          <div className="home-about__socials">
            <a
              href="https://www.instagram.com/aperixstudio/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Aperix Studio on Instagram"
              className="home-about__social-link"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                <circle cx="12" cy="12" r="4.6" />
                <circle cx="17.4" cy="6.6" r="1.05" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61592081181549"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Aperix Studio on Facebook"
              className="home-about__social-link"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M15.5 8.5h-2a1.5 1.5 0 0 0-1.5 1.5v2h3.4l-.5 3H12v7h-3v-7H7v-3h2v-2.3C9 7.6 10.6 6 13.1 6H15.5v2.5Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
