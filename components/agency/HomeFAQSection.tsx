"use client";

import { useId, useState } from "react";
import { FAQ_ITEMS } from "@/lib/services-content";
import "./HomeFAQSection.css";

export default function HomeFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const headingId = useId();

  return (
    <section
      id="faq"
      className="home-faq"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="sr-only">
        Frequently asked questions
      </h2>

      <div className="home-faq__list">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `home-faq-panel-${index}`;
          const triggerId = `home-faq-trigger-${index}`;

          return (
            <div key={item.question} className="home-faq__item">
              <button
                id={triggerId}
                type="button"
                className="home-faq__question"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                {item.question}
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="home-faq__answer-wrap"
                data-open={isOpen || undefined}
              >
                <p className="home-faq__answer">{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
