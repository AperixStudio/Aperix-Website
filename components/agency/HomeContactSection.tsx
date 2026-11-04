"use client";

import { useEffect } from "react";
import ContactForm from "@/components/agency/ContactForm";
import "@/app/contact/ContactPage.css";
import "./HomeContactSection.css";

function scrollContactIntoView() {
  if (window.location.hash !== "#contact") return;
  const section = document.getElementById("contact");
  if (!section) return;
  const scrollMarginTop = Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
  const top = section.getBoundingClientRect().top + window.scrollY - scrollMarginTop;
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
}

export default function HomeContactSection() {
  // Client navigations to /#contact update the hash, then the home page
  // keeps growing as the hero lays out. Follow that until the form sits at
  // the top, and stop so a later manual scroll is left alone.
  useEffect(() => {
    if (window.location.hash !== "#contact") return undefined;

    let stopped = false;
    const align = () => {
      if (!stopped) scrollContactIntoView();
    };

    align();
    const observer = new ResizeObserver(align);
    observer.observe(document.documentElement);
    const stop = window.setTimeout(() => {
      stopped = true;
      scrollContactIntoView();
      observer.disconnect();
    }, 1600);
    const onHash = () => {
      stopped = false;
      align();
    };
    window.addEventListener("hashchange", onHash);

    return () => {
      stopped = true;
      observer.disconnect();
      window.clearTimeout(stop);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return (
    <section
      id="contact"
      className="home-contact-section contact-page px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24 lg:pb-8"
      aria-labelledby="home-contact-heading"
    >
      <div className="home-contact-section__shell contact-page__shell mx-auto max-w-6xl">
        <ContactForm
          kicker="Next step"
          heading="Ready to build?"
          headingId="home-contact-heading"
          headingAs="h2"
          lede="Four short questions. We'll reply within 24 hours."
        />
      </div>
    </section>
  );
}
