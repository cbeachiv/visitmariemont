import { collections, toDocs } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PlacesManager from "@/components/admin/PlacesManager";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPlacesPage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const snap = await collections.places().orderBy("name").get();
  const places = toDocs(snap);

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <nav className="bg-[#0b2618] text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="font-body text-white/60 text-sm hover:text-white transition-colors">
          ← Dashboard
        </Link>
        <span className="text-white/20">/</span>
        <p className="font-body text-white text-sm">Places Database</p>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <PlacesManager initialPlaces={JSON.parse(JSON.stringify(places))} />
      </div>
    </div>
  );
}
