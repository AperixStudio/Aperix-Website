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
