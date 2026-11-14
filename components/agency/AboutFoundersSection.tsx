import Link from "next/link";
import "./AboutFoundersSection.css";
import "./ServicesIndex.css";

const FOUNDERS = [
  {
    id: "tom",
    name: "Tom",
    role: "Co-founder & Developer",
    bio: "Tom comes from electronic engineering and software. The engineering side is systems, hardware, and how the pieces connect. The software side is what clients actually use. That mix is why a website, an app, and the parts that have to talk to each other get built as one job.",
  },
  {
    id: "harrison",
    name: "Harrison",
    role: "Co-founder & Developer",
    bio: "Harrison comes from computer science and AI. He works on the product logic and the parts of a build that need to reason, from custom software through to anything on the site that has to think.",
  },
] as const;

/** Founder bios. About page only — the homepage keeps the short studio blurb. */
export default function AboutFoundersSection() {
  return (
    <section className="about-founders" aria-labelledby="about-founders-heading">
      <div className="about-founders__inner">
        <p className="about-founders__eyebrow">The founders</p>
        <h2 id="about-founders-heading" className="about-founders__heading">
          Two backgrounds. One studio.
        </h2>
        <p className="about-founders__lede">
          Aperix is a small software studio that cares about your business. We learn how you work and who you serve, then build the website, the app, or the software around that.
        </p>

        <div className="about-founders__grid">
          {FOUNDERS.map((founder) => (
            <article key={founder.id} className="about-founders__card">
              <h3 className="about-founders__name">{founder.name}</h3>
              <p className="about-founders__role">{founder.role}</p>
              <p className="about-founders__bio">{founder.bio}</p>
            </article>
          ))}
        </div>

        <p className="about-founders__closer">
          You work with both of us. There is no account layer in between.
        </p>
        <Link href="/contact" className="services-index__cta about-founders__cta">
          Contact us
        </Link>
      </div>
    </section>
  );
}
