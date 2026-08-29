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
        </div>
      </div>
    </section>
  );
}
