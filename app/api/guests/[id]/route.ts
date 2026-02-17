import { NextResponse } from "next/server";
import { collections } from "@/lib/firebase-admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const doc = await collections.guests().doc(id).get();
  if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Get events
  const eventsSnap = await collections
    .events()
    .where("guestId", "==", id)
    .orderBy("dayNumber")
    .orderBy("sortOrder")
    .get();
  const events = eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return NextResponse.json({ id: doc.id, ...doc.data(), events });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  if (body.name) updates.name = body.name;
  if (body.arrivalDate) updates.arrivalDate = body.arrivalDate;
  if (body.departureDate) updates.departureDate = body.departureDate;
  if (typeof body.itineraryPublished === "boolean")
    updates.itineraryPublished = body.itineraryPublished;

  await collections.guests().doc(id).update(updates);
  const doc = await collections.guests().doc(id).get();
  return NextResponse.json({ id: doc.id, ...doc.data() });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Delete guest's events first
  const eventsSnap = await collections.events().where("guestId", "==", id).get();
  const batch = collections.events().firestore.batch();
  eventsSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(collections.guests().doc(id));
  await batch.commit();

  return NextResponse.json({ success: true });
}
