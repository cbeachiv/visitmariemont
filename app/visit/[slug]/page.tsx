import { notFound } from "next/navigation";
import { collections } from "@/lib/firebase-admin";
import Timeline from "@/components/itinerary/Timeline";
import FineTracker from "@/components/itinerary/FineTracker";

export const dynamic = "force-dynamic";

export default async function ItineraryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const guestSnap = await collections.guests().where("slug", "==", slug).limit(1).get();
  if (guestSnap.empty) notFound();

  const guestDoc = guestSnap.docs[0];
  const guest = { id: guestDoc.id, ...guestDoc.data() } as {
    id: string;
    name: string;
    arrivalDate: string;
    departureDate: string;
    itineraryPublished: boolean;
  };

  if (!guest.itineraryPublished) notFound();

  const eventsSnap = await collections
    .events()
    .where("guestId", "==", guest.id)
    .orderBy("dayNumber")
    .orderBy("sortOrder")
    .get();

  const events = eventsSnap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as {
      dayNumber: number;
      time: string;
      eventName: string;
      locationName: string;
      address: string | null;
      notes: string | null;
      link: string | null;
      category: string;
    }),
  }));

  const arrivalLabel = new Date(guest.arrivalDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const departureLabel = new Date(guest.departureDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="bg-[#0b2618] text-white px-6 py-10 text-center">
        <p className="font-body text-[#78ddaa] text-xs tracking-[0.25em] uppercase mb-3">
          Official Itinerary — Mariemont Bureau of Visitor Affairs
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">
          {guest.name}&apos;s Visit
        </h1>
        <p className="font-body text-white/60 text-base">
          {arrivalLabel} – {departureLabel}
        </p>
        <p className="font-body text-white/40 text-sm mt-4 italic max-w-md mx-auto">
          This document is classified. Do not share with anyone who wasn&apos;t invited.
        </p>
      </div>

      <div className="pt-6">
        <FineTracker events={events} />
      </div>

      <Timeline events={events} arrivalDate={guest.arrivalDate} />

      <div className="bg-[#0b2618] text-white/40 text-center py-8 px-6">
        <p className="font-body text-sm">
          Prepared with care (and a lot of jokes) by the Mariemont Bureau of Visitor Affairs.
        </p>
        <p className="font-body text-xs mt-1">
          All fines are legally unenforceable but spiritually binding.
        </p>
      </div>
    </div>
  );
}
