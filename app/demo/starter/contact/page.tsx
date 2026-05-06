import { type Metadata } from "next";
import LocationHours from "@/components/demos/hearthstone/LocationHours";

export const metadata: Metadata = {
  title: "Visit — Hearthstone Café Fitzroy | Aperix Demo",
  description:
    "A Growth-tier contact and location page for Hearthstone Café, with hours, address, and enquiry details separated from the homepage.",
};

export default function HearthstoneContactPage() {
  return (
    <main>
      <section className="bg-[#1c1612] px-6 py-16 text-center lg:py-20">
        <p className="font-(family-name:--font-hs-mono) text-xs font-semibold uppercase tracking-[0.24em] text-[#e8c547]">
          Visit Us
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-(family-name:--font-hs-display) text-4xl font-bold text-white md:text-5xl">
          Location, hours, and simple enquiry details.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-(family-name:--font-hs-body) text-base leading-relaxed text-white/70">
          A dedicated contact page is a better fit for the Growth tier than forcing all location and enquiry details into one long homepage.
        </p>
      </section>
      <LocationHours />
      <section className="bg-[#faf7f2] px-6 pb-20">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {[
            ["Phone", "(03) 9417 2240"],
            ["Email", "hello@hearthstone.example"],
            ["Address", "124 Rose Street, Fitzroy VIC"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[#e8e0d5] bg-white p-6 text-center shadow-sm">
              <p className="font-(family-name:--font-hs-mono) text-xs font-semibold uppercase tracking-[0.18em] text-[#8b5e3c]">{label}</p>
              <p className="mt-2 font-(family-name:--font-hs-body) text-base font-semibold text-[#1c1612]">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
