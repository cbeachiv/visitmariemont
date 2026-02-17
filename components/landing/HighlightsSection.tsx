const highlights = [
  {
    title: "Historic District",
    subtitle: "A National Landmark",
    description:
      "One of America's only intact planned communities. Tudor architecture, cobblestone charm, and the kind of streets that make you feel underdressed.",
    image:
      "https://mariemont.org/wp-content/uploads/2024/09/Town_center_-_Mariemont_Ohio_-_DSC03888-1024x683-1.jpg",
    tag: "Culture & Architecture",
  },
  {
    title: "The Food Scene",
    subtitle: "From Skyline to Fine Dining",
    description:
      "Cincinnati chili, legendary pizza, and the Mariemont Inn restaurant. Your taste buds are about to have the best weekend of their lives.",
    image:
      "https://mariemont.org/wp-content/uploads/2024/12/Concourse092020-scaled-e1601655336831.jpg",
    tag: "Dining & Drinks",
  },
  {
    title: "Trails & Outdoors",
    subtitle: "75+ Acres of Adventure",
    description:
      "The Little Miami Trail, South 80 wooded paths, and Dogwood Park. Whether you're a power walker or an elite trail runner, we have something for you.",
    image:
      "https://mariemont.org/wp-content/uploads/2020/03/South-80-Trails-and-Community-Garden.jpg",
    tag: "Outdoor Activities",
  },
];

export default function HighlightsSection() {
  return (
    <section className="bg-[#f7f4ef] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-[#78ddaa] text-sm tracking-[0.2em] uppercase font-medium mb-3">
            What Awaits You
          </p>
          <h2 className="font-heading text-[#0b2618] text-4xl md:text-5xl font-bold mb-4">
            The Official Highlights
          </h2>
          <p className="font-body text-stone-600 text-lg max-w-xl mx-auto">
            Your itinerary will be personally curated from these categories and
            more — with jokes included at no extra charge.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={h.image}
                  alt={h.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#0b2618]/30 group-hover:bg-[#0b2618]/10 transition-colors duration-300" />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#78ddaa] text-[#0b2618] text-xs font-body font-bold px-3 py-1 rounded-full">
                    {h.tag}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="font-body text-stone-400 text-xs tracking-widest uppercase mb-1">
                  {h.subtitle}
                </p>
                <h3 className="font-heading text-[#0b2618] text-2xl font-bold mb-3">
                  {h.title}
                </h3>
                <p className="font-body text-stone-600 text-sm leading-relaxed">
                  {h.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
