/* ────────────────────────────────────────────────────────────
   SootheServiceArea — PRD §6.3.5
   "Where I work" — CSS map placeholder + 10 suburb tags.
   ──────────────────────────────────────────────────────────── */

const suburbs = [
  "Fitzroy",
  "Collingwood",
  "Richmond",
  "Prahran",
  "South Yarra",
  "Hawthorn",
  "Kew",
  "Carlton",
  "Brunswick",
  "Northcote",
];

export default function SootheServiceArea() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        {/* heading */}
        <h2 className="font-(family-name:--font-soothe) text-3xl font-bold text-[#3a3530] md:text-4xl">
          Where I work
        </h2>
        <p className="mx-auto mt-3 max-w-md font-(family-name:--font-soothe) text-base text-[#8a8078]">
          I service Melbourne&apos;s inner suburbs — roughly a 10&thinsp;km
          radius from the CBD.
        </p>

        {/* CSS map placeholder */}
        <div className="mx-auto mt-10 max-w-lg">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#e8e3dc] bg-[#f7f5f2]">
            {/* grid pattern */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #e8e3dc 1px, transparent 1px), linear-gradient(to bottom, #e8e3dc 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            {/* "roads" */}
            <div
              aria-hidden="true"
              className="absolute top-1/3 right-0 left-0 h-0.5 bg-[#c8ddd0]"
            />
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[45%] w-0.5 bg-[#c8ddd0]"
            />
            <div
              aria-hidden="true"
              className="absolute top-[55%] right-0 left-0 h-0.5 rotate-12 bg-[#c8ddd0]/60"
            />

            {/* coverage circle */}
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#7a9e87]/40 bg-[#7a9e87]/10"
            />

            {/* pin marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
              <svg
                width="28"
                height="38"
                viewBox="0 0 32 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Map pin"
              >
                <path
                  d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26C32 7.163 24.837 0 16 0z"
                  fill="#7a9e87"
                />
                <circle cx="16" cy="16" r="6" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        {/* suburb tags */}
        <div className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-2.5">
          {suburbs.map((suburb) => (
            <span
              key={suburb}
              className="rounded-full border border-[#e8e3dc] bg-[#fdf9f4] px-4 py-2 font-(family-name:--font-soothe) text-sm font-medium text-[#3a3530]"
            >
              {suburb}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
