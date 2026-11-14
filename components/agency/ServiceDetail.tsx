import Link from "next/link";
import type { ReactNode } from "react";
import "./ServiceDetail.css";

export type ServiceDetailSection = {
  title: string;
  body: ReactNode;
};

/** Long-form offer page. Deliberately not the services index. */
export default function ServiceDetail({
  title,
  lede,
  close,
  sections,
}: {
  title: string;
  lede: string;
  close: string;
  sections: ServiceDetailSection[];
}) {
  return (
    <article className="offer">
      <header className="offer__hero">
        <p className="offer__kicker">Offer</p>
        <h1 className="offer__title">{title}</h1>
        <p className="offer__lede">{lede}</p>
      </header>

      <div className="offer__sections">
        {sections.map((section) => (
          <section key={section.title} className="offer__section">
            <h2 className="offer__label">{section.title}</h2>
            <div className="offer__copy">{section.body}</div>
          </section>
        ))}
      </div>

      <footer className="offer__end">
        <p className="offer__close">{close}</p>
        <Link href="/contact" className="offer__cta">
          Contact us
        </Link>
      </footer>
    </article>
  );
}
