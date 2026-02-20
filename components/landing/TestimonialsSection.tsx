const testimonials = [
  {
    quote:
      "What a beautiful community. Tudor streets, friendly faces, and yes, the Skyline cheese coneys with the Oreo cheesecake lived up to the hype.",
    name: "Tyler H",
    location: "Solana Beach, CA",
  },
  {
    quote:
      "I expected a quiet farm town in the middle of nowhere. Instead, I found architecture, walkable streets, and more charm than I was prepared for.",
    name: "Abby B",
    location: "Perth, Australia",
  },
  {
    quote:
      "We spent the afternoon walking the village with our dog, Maple. Great trails, beautiful square, and yes, the drinks at the Mariemont Inn are strong. We'll be back.",
    name: "Drew & Meghan S",
    location: "Carlsbad, CA",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-[#e8a84e] text-sm tracking-[0.2em] uppercase font-medium mb-3">
            Visitor Dispatches
          </p>
          <h2 className="font-heading text-[#0b2618] text-4xl md:text-5xl font-bold mb-4">
            They Came. They Stayed Too Long.
          </h2>
          <p className="font-body text-stone-600 text-lg max-w-xl mx-auto">
            Unsolicited reviews from guests who were not paid, bribed, or
            otherwise coerced by the Bureau.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[#f7f4ef] rounded-2xl p-8 flex flex-col justify-between"
            >
              <div>
                <span className="font-heading text-[#e8a84e] text-5xl leading-none select-none">
                  &ldquo;
                </span>
                <p className="font-body text-[#0b2618] text-base leading-relaxed -mt-2">
                  {t.quote}
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-stone-200">
                <p className="font-heading text-[#0b2618] font-bold text-base">
                  {t.name}
                </p>
                <p className="font-body text-stone-400 text-sm tracking-wide">
                  {t.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
