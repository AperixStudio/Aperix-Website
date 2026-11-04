import Link from "next/link";
import { STUDIO_SERVICES } from "@/lib/services-content";
import "./ServicesIndex.css";

function serviceNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** Services index. Content lives in STUDIO_SERVICES — add an entry and it shows up here. */
export default function ServicesIndex() {
  return (
    <div className="services-index">
      <header className="services-index__intro">
        <div>
          <p className="services-index__eyebrow">Services</p>
          <h1 className="services-index__heading">Our most popular services</h1>
        </div>
        <p className="services-index__lede">
          Custom websites, web apps, software, and mobile apps. Built by the two of
          us in Melbourne, and scoped to the job rather than a package.
        </p>
      </header>

      <ol className="services-index__list">
        {STUDIO_SERVICES.map((service, index) => (
          <li key={service.id} id={service.id} className="services-index__row">
            <span className="services-index__number" aria-hidden="true">
              {serviceNumber(index)}
            </span>
            <h2 className="services-index__name">{service.name}</h2>
            <div className="services-index__body">
              <p className="services-index__summary">{service.summary}</p>
              {service.covers.length > 0 ? (
                <ul className="services-index__covers">
                  {service.covers.map((cover) => (
                    <li key={cover}>{cover}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="services-index__close">
        <p className="services-index__close-copy">
          Don&apos;t see the exact thing? Describe what you want to ship. We&apos;ll
          reply with a fixed quote and a timeline.
        </p>
        <Link href="/#contact" className="services-index__cta">
          Contact us
        </Link>
      </div>
    </div>
  );
}
