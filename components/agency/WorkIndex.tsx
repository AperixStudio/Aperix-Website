import Link from "next/link";
import HashLink from "@/components/agency/HashLink";
import { CAROUSEL_SITES, caseStudyId } from "@/lib/liveSites";
import "./ServicesIndex.css";

const SERVICE_LINKS: Record<string, { href: string; label: string }> = {
  "Nails by Avy": { href: "/services#web-design", label: "web design" },
  "The Hidden Chapter": { href: "/ecommerce-websites", label: "ecommerce websites" },
  "POV Sync": { href: "/custom-software-development", label: "custom software development" },
  "Complete Trade Solutions": { href: "/web-design-for-tradies", label: "websites for tradies" },
  "National Roofing Solutions": { href: "/web-design-for-tradies", label: "websites for tradies" },
};

function projectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** Case-study index. Rhino's Walk stays in the catalogue and off this list. */
export default function WorkIndex() {
  return (
    <div className="services-index">
      <header className="services-index__intro">
        <div>
          <p className="services-index__eyebrow">Our work</p>
          <h1 className="services-index__heading">
            Website case studies for businesses Aperix has created.
          </h1>
        </div>
        <p className="services-index__lede">
          Live sites we have shipped: a booking studio, a shop, a web app, and
          trade businesses in Melbourne and Victoria.
        </p>
      </header>

      <ol className="services-index__list">
        {CAROUSEL_SITES.map((site, index) => {
          const service = SERVICE_LINKS[site.name];
          return (
            <li key={site.name} id={caseStudyId(site.name)} className="services-index__row">
              <span className="services-index__number" aria-hidden="true">
                {projectNumber(index)}
              </span>
              <h2 className="services-index__name">{site.name}</h2>
              <div className="services-index__body">
                <p className="services-index__summary">{site.summary}</p>
                {site.scope.length > 0 ? (
                  <ul className="services-index__covers">
                    {site.scope.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {service ? (
                  <p className="services-index__proof">
                    See <Link href={service.href}>{service.label}</Link>.
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="services-index__close">
        <p className="services-index__close-copy">
          Want something in this line? Describe what you want to ship. We&apos;ll
          reply with a fixed quote and a timeline.
        </p>
        <HashLink href="#contact" className="services-index__cta">
          Contact us
        </HashLink>
      </div>
    </div>
  );
}
