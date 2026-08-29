import ContactForm from "@/components/agency/ContactForm";
import "@/app/contact/ContactPage.css";
import "./HomeContactSection.css";

export default function HomeContactSection() {
  return (
    <section
      id="contact"
      className="home-contact-section contact-page px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24 lg:pb-8"
      aria-labelledby="home-contact-heading"
    >
      <div className="home-contact-section__shell contact-page__shell mx-auto max-w-6xl">
        <div className="contact-page__intro">
          <p className="contact-page__kicker">Next step</p>
          <h2 id="home-contact-heading" className="contact-page__heading">
            Ready to build?
          </h2>
          <p className="contact-page__lede">
            Tell us what your business needs — we&apos;ll reply with the best-fit package, a clear
            next step, and the timeline to expect.
          </p>
        </div>

        <div className="contact-page__form">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
