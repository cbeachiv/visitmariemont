export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://mariemont.org/wp-content/uploads/2024/09/The-Village-Aerial1-1024x625-1.jpg)",
        }}
      />
      {/* Dark green overlay */}
      <div className="absolute inset-0 bg-[#0b2618]/75" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Seal / badge */}
        <div className="inline-block border border-[#78ddaa]/40 rounded-full px-5 py-2 mb-8">
          <span className="text-[#78ddaa] text-sm tracking-[0.2em] uppercase font-body font-medium">
            Mariemont Bureau of Visitor Affairs
          </span>
        </div>

        <h1 className="font-heading text-white text-5xl md:text-7xl font-bold leading-tight mb-6">
          Welcome to the
          <br />
          <span className="text-[#78ddaa]">Village of Mariemont.</span>
        </h1>

        <p className="font-heading text-white/80 text-xl md:text-2xl italic mb-4">
          Population: Charming.
        </p>

        <p className="font-body text-white/70 text-base md:text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Your personalized visit has been prepared by the finest hospitality
          operation in southwestern Ohio. Tell us a bit about yourself so we can
          get started.
        </p>

        {/* CTA */}
        <a
          href="https://forms.gle/wjZgejMybTzDjZqz9"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-10 py-5 bg-[#78ddaa] text-[#0b2618] font-body font-bold text-lg rounded-lg hover:bg-[#5ec996] transition-colors"
        >
          Start Your Trip →
        </a>

        <p className="font-body text-white/40 text-sm mt-6">
          Guests only. Not sure you're on the list?{" "}
          <span className="text-[#78ddaa]/70">Ask your host.</span>
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm font-body flex flex-col items-center gap-2">
        <span className="tracking-widest text-xs uppercase">Scroll</span>
        <div className="w-px h-8 bg-white/20" />
      </div>
    </section>
  );
}
