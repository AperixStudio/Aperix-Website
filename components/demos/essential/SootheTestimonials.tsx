/* ────────────────────────────────────────────────────────────
   SootheTestimonials — PRD §6.3.6
   3 STATIC review cards in a grid. NO carousel, NO JS.
  Basic tier constraint.
   ──────────────────────────────────────────────────────────── */

const reviews = [
  {
    text: "Emma is wonderful. I have chronic shoulder tension from years of desk work and after just two sessions I felt a huge difference. She's professional, punctual, and genuinely cares.",
    name: "Kate R.",
    suburb: "Richmond",
  },
  {
    text: "Booked a relaxation massage after a really stressful week and it was exactly what I needed. Emma set up in my lounge room and the whole experience was so easy. Already booked my next one.",
    name: "Michael T.",
    suburb: "Fitzroy",
  },
  {
    text: "We booked Emma for a corporate wellness day at our studio and the team absolutely loved it. She was organised, friendly, and everyone felt amazing afterwards. Highly recommend.",
    name: "Priya S.",
    suburb: "Hawthorn",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#c9a96e"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function SootheTestimonials() {
  return (
    <section className="bg-[#f7f5f2] py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        {/* heading */}
        <h2 className="font-(family-name:--font-soothe) text-3xl font-bold text-[#3a3530] md:text-4xl">
          What my clients say
        </h2>

        {/* cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-2xl border border-[#e8e3dc] bg-white p-7 text-left"
            >
              <Stars />
              <p className="mt-4 font-(family-name:--font-soothe) text-sm leading-relaxed text-[#3a3530]">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-(family-name:--font-soothe) text-sm font-bold text-[#3a3530]">
                  {review.name}
                </span>
                <span className="font-(family-name:--font-soothe) text-xs text-[#8a8078]">
                  {review.suburb}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
