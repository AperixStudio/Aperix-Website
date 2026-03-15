/* ────────────────────────────────────────────────────────────
   ApexReviews — PRD §8.3.2
   4 Google review cards: Mark D. · Rachel S. · David W. · Lisa P.
   ──────────────────────────────────────────────────────────── */

const reviews = [
  {
    author: "Mark D.",
    rating: 5,
    date: "2 weeks ago",
    body: "James and the team were fantastic — turned up on time, explained everything clearly, and the quote was exactly what we paid. Highly recommend for any residential work.",
  },
  {
    author: "Rachel S.",
    rating: 5,
    date: "1 month ago",
    body: "Called them at 9pm for an emergency and they were there within 45 minutes. Fixed the fault, professional and fair pricing. Will use again.",
  },
  {
    author: "David W.",
    rating: 5,
    date: "6 weeks ago",
    body: "Did the full electrical fit-out for our new South Yarra office. Delivered on time and within budget. Really impressed with the attention to detail.",
  },
  {
    author: "Lisa P.",
    rating: 5,
    date: "2 months ago",
    body: "Had them install solar and a battery — the system works perfectly and they walked us through everything. The savings on our bills have been amazing.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[#f59e0b]" aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

export default function ApexReviews() {
  return (
    <section className="bg-[#0c0a09] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
            Reviews
          </p>
          <h2 className="font-(family-name:--font-apex-heading) text-3xl font-extrabold text-white md:text-4xl">
            What our customers say
          </h2>
          <p className="mt-3 font-(family-name:--font-apex-body) text-sm text-white/50">
            4.9 ★ on Google · 500+ reviews
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map(({ author, rating, date, body }) => (
            <div
              key={author}
              className="flex flex-col rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-1 hover:ring-[#f59e0b]/30"
            >
              <StarRating count={rating} />
              <p className="mt-3 flex-1 font-(family-name:--font-apex-body) text-sm leading-relaxed text-white/70">
                &ldquo;{body}&rdquo;
              </p>
              <div className="mt-5 flex items-center justify-between">
                <p className="font-(family-name:--font-apex-heading) text-sm font-bold text-white">
                  {author}
                </p>
                <p className="font-(family-name:--font-apex-body) text-xs text-white/40">
                  {date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
