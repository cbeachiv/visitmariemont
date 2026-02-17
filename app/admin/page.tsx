import { collections, toDocs } from "@/lib/firebase-admin";
import GuestTable from "@/components/admin/GuestTable";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface GuestRow {
  id: string;
  surveyCompleted: boolean;
  itineraryPublished: boolean;
  [key: string]: unknown;
}

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const snap = await collections.guests().orderBy("createdAt", "desc").get();
  const guests = toDocs<GuestRow>(snap);

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <nav className="bg-[#0b2618] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold">🏛️ Bureau Control Room</h1>
          <p className="font-body text-white/50 text-xs">Visit Mariemont — Admin</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/places" className="font-body text-white/70 text-sm hover:text-white transition-colors">
            Places Database
          </Link>
          <Link href="/" className="font-body text-white/70 text-sm hover:text-white transition-colors">
            View Site
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Guests", value: guests.length, color: "text-[#0b2618]" },
            { label: "Awaiting Survey", value: guests.filter((g) => !g.surveyCompleted).length, color: "text-amber-600" },
            { label: "Ready to Review", value: guests.filter((g) => g.surveyCompleted && !g.itineraryPublished).length, color: "text-blue-600" },
            { label: "Published", value: guests.filter((g) => g.itineraryPublished).length, color: "text-green-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-stone-200 p-5">
              <p className="font-body text-stone-400 text-xs uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`font-heading text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <GuestTable initialGuests={JSON.parse(JSON.stringify(guests))} />
      </div>
    </div>
  );
}
