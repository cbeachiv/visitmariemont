export default function CommunitySection() {
  return (
    <section className="bg-[#0b2618] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <p className="font-body text-[#78ddaa] text-sm tracking-[0.2em] uppercase font-medium mb-4">
              About Mariemont
            </p>
            <h2 className="font-heading text-white text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Not Just a Village.
              <br />
              <span className="text-[#78ddaa]">A Vibe.</span>
            </h2>
            <div className="font-body text-white/70 text-base leading-relaxed space-y-4">
              <p>
                Founded in 1923 as a National Historic Landmark planned
                community, the Village of Mariemont is a rare gem tucked just
                east of Cincinnati. Tudor architecture, walkable streets, and
                the kind of local pride that makes residents accidentally become
                spokespeople.
              </p>
              <p>
                It has a real mayor. A real village square. And a real pool that
                residents take extremely seriously. Your host has lived here long
                enough to know all the best spots — and which ones to avoid
                (looking at you, construction on Wooster Pike).
              </p>
              <p className="text-[#78ddaa] font-medium italic">
                "The Mariemont Bureau of Visitor Affairs thanks you for choosing
                us over literally anywhere else."
              </p>
            </div>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://mariemont.org/wp-content/uploads/2024/09/Tree-Lighting-2022-scaled.jpg"
              alt="Mariemont community event"
              className="rounded-xl w-full h-48 object-cover"
            />
            <img
              src="https://mariemont.org/wp-content/uploads/2024/09/Fireworks_Joe-Stoner_2019-07-04.jpg"
              alt="Mariemont fireworks"
              className="rounded-xl w-full h-48 object-cover"
            />
            <img
              src="https://mariemont.org/wp-content/uploads/2024/12/806_5138_2_web.jpg"
              alt="Mariemont community"
              className="rounded-xl w-full h-48 object-cover col-span-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
