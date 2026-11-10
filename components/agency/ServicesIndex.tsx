import Link from "next/link";
import HashLink from "@/components/agency/HashLink";
import ReceptionistMascot from "@/components/agency/ReceptionistMascot";
import { caseStudyId } from "@/lib/liveSites";
import { STUDIO_SERVICES } from "@/lib/services-content";
import "./ServicesIndex.css";

function serviceNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function ServiceHeading({ service }: { service: (typeof STUDIO_SERVICES)[number] }) {
  return (
    <h2 className="services-index__name">
      {service.call ? <a href={service.call.href}>{service.name}</a> : service.name}
    </h2>
  );
}

/** Services index. Content lives in STUDIO_SERVICES — add an entry and it shows up here. */
export default function ServicesIndex() {
  return (
    <div className="services-index">
      <header className="services-index__intro">
        <div>
          <p className="services-index__eyebrow">Services</p>
          <h1 className="services-index__heading">
            Websites, software, apps, and an AI receptionist
          </h1>
        </div>
        <p className="services-index__lede">
          Custom websites, web apps, software, mobile apps, and an AI receptionist.
          Built by the two of us in Melbourne, and scoped to the job rather than a
          package.
        </p>
      </header>

      <ol className="services-index__list">
        {STUDIO_SERVICES.map((service, index) => (
          <li key={service.id} id={service.id} className="services-index__row">
            <span className="services-index__number" aria-hidden="true">
              {serviceNumber(index)}
            </span>
            {service.id === "ai-receptionist" ? (
              <div className="services-index__title">
                <ServiceHeading service={service} />
                <ReceptionistMascot />
              </div>
            ) : (
              <ServiceHeading service={service} />
            )}
            <div className="services-index__body">
              <p className="services-index__summary">{service.summary}</p>
              {service.covers.length > 0 ? (
                <ul className="services-index__covers">
                  {service.covers.map((cover) => (
                    <li key={cover}>{cover}</li>
                  ))}
                </ul>
              ) : null}
              {service.call ? (
                <p className="services-index__proof">
                  Call the bot on <a href={service.call.href}>{service.call.number}</a>.
                </p>
              ) : null}
              {service.caseStudies && service.caseStudies.length > 0 ? (
                <p className="services-index__proof">
                  {service.caseStudies.map((study) => (
                    <span key={study.name}>
                      {study.before}
                      <Link href={`/our-work#${caseStudyId(study.name)}`}>{study.name}</Link>
                      {study.after}
                    </span>
                  ))}
                </p>
              ) : null}
              {service.pages && service.pages.length > 0 ? (
                <p className="services-index__proof">
                  {service.pages.map((page) => (
                    <span key={page.href}>
                      {page.before}
                      <Link href={page.href}>{page.label}</Link>
                      {page.after}
                    </span>
                  ))}
                </p>
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
        <HashLink href="#contact" className="services-index__cta">
          Contact us
        </HashLink>
      </div>
    </div>
  );
}
