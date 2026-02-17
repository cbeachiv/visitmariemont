export default function Footer() {
  return (
    <footer className="bg-[#0b2618] border-t border-white/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="font-heading text-white text-lg font-bold">
            Visit Mariemont
          </p>
          <p className="font-body text-white/40 text-sm">
            An unofficial production of the Mariemont Bureau of Visitor Affairs
          </p>
        </div>
        <div className="font-body text-white/40 text-sm text-center md:text-right">
          <p>Village of Mariemont, Ohio 45227</p>
          <p className="mt-1">
            Not affiliated with the actual Village of Mariemont government.
            <br />
            (Though the mayor is aware of us and thinks it&apos;s very funny.)
          </p>
        </div>
      </div>
    </footer>
  );
}
