import { cn } from "@/lib/utils";
import "./SocialProofBar.css";

const PHRASES = [
  "Two-person team · Melbourne",
  "Websites, web apps & SaaS",
  "Hand-coded from scratch",
  "Small builds welcome",
  "Side projects & full products",
  "Open to a chat anytime",
];

export default function SocialProofBar() {
  const items = [...PHRASES, ...PHRASES];

  return (
    <section aria-label="Studio notes" className="social-proof-bar px-6 py-8 lg:px-12">
      <div className="social-proof-bar__frame mx-auto max-w-7xl rounded-[2rem] p-3">
        <div className="social-proof-bar__track relative overflow-hidden rounded-full px-4 py-3">
          <div
            aria-hidden="true"
            className="social-proof-bar__fade social-proof-bar__fade--left pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
          />
          <div
            aria-hidden="true"
            className="social-proof-bar__fade social-proof-bar__fade--right pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
          />

          <div className="marquee-track flex w-max gap-8 sm:gap-10">
            {items.map((phrase, i) => (
              <span
                key={`${phrase}-${i}`}
                className={cn(
                  "social-proof-bar__pill shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase sm:px-4 sm:text-xs",
                  i % 3 === 0 && "social-proof-bar__pill--accent",
                )}
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
