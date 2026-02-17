import { notFound, redirect } from "next/navigation";
import { collections } from "@/lib/firebase-admin";
import { getServerSession } from "next-auth";
import ItineraryEditor from "@/components/admin/ItineraryEditor";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminGuestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;

  const [guestDoc, placesSnap, eventsSnap] = await Promise.all([
    collections.guests().doc(id).get(),
    collections.places().orderBy("name").get(),
    collections.events().where("guestId", "==", id).orderBy("dayNumber").orderBy("sortOrder").get(),
  ]);

  if (!guestDoc.exists) notFound();

  const guest = { id: guestDoc.id, ...guestDoc.data() } as {
    id: string;
    name: string;
    slug: string;
    surveyCompleted: boolean;
    itineraryPublished: boolean;
  };

  const places = placesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const events = eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <nav className="bg-[#0b2618] text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="font-body text-white/60 text-sm hover:text-white transition-colors">
          ← Dashboard
        </Link>
        <span className="text-white/20">/</span>
        <p className="font-body text-white text-sm">{guest.name}</p>
      </nav>

      {!guest.surveyCompleted && (
        <div className="bg-amber-100 border-b border-amber-200 px-6 py-3 text-center">
          <p className="font-body text-amber-800 text-sm">
            ⚠️ {guest.name} hasn&apos;t completed their survey yet. No auto-generated itinerary available.
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <ItineraryEditor
          guestId={guest.id}
          guestName={guest.name}
          guestSlug={guest.slug}
          initialEvents={JSON.parse(JSON.stringify(events))}
          places={JSON.parse(JSON.stringify(places))}
          published={guest.itineraryPublished}
        />
      </div>
    </div>
  );
}
