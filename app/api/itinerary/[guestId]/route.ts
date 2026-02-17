import { NextResponse } from "next/server";
import { collections } from "@/lib/firebase-admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ guestId: string }> }
) {
  const { guestId } = await params;
  const snap = await collections
    .events()
    .where("guestId", "==", guestId)
    .orderBy("dayNumber")
    .orderBy("sortOrder")
    .get();
  const events = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json(events);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ guestId: string }> }
) {
  const { guestId } = await params;
  const body = await req.json();

  // Batch reorder
  if (Array.isArray(body.events)) {
    const batch = collections.events().firestore.batch();
    for (const e of body.events as { id: string; sortOrder: number; dayNumber: number }[]) {
      batch.update(collections.events().doc(e.id), {
        sortOrder: e.sortOrder,
        dayNumber: e.dayNumber,
      });
    }
    await batch.commit();
    return NextResponse.json({ success: true });
  }

  // Single event update
  if (body.id) {
    const updates: Record<string, unknown> = {};
    const fields = ["time", "eventName", "locationName", "address", "notes", "link", "category", "sortOrder"];
    for (const f of fields) {
      if (body[f] !== undefined) updates[f] = body[f];
    }
    await collections.events().doc(body.id).update(updates);
    const doc = await collections.events().doc(body.id).get();
    return NextResponse.json({ id: doc.id, ...doc.data() });
  }

  // New event
  if (body.new) {
    const daySnap = await collections
      .events()
      .where("guestId", "==", guestId)
      .where("dayNumber", "==", body.dayNumber || 1)
      .orderBy("sortOrder", "desc")
      .limit(1)
      .get();
    const maxSort = daySnap.empty ? 0 : (daySnap.docs[0].data().sortOrder as number);

    const data = {
      guestId,
      dayNumber: body.dayNumber || 1,
      time: body.time || "12:00 PM",
      sortOrder: maxSort + 1,
      eventName: body.eventName || "New Event",
      locationName: body.locationName || "",
      placeId: body.placeId || null,
      address: body.address || "",
      notes: body.notes || "",
      link: body.link || null,
      category: body.category || "activity",
      createdAt: new Date().toISOString(),
    };
    const ref = await collections.events().add(data);
    return NextResponse.json({ id: ref.id, ...data }, { status: 201 });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ guestId: string }> }
) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  await params;

  if (!eventId) {
    return NextResponse.json({ error: "eventId required" }, { status: 400 });
  }

  await collections.events().doc(eventId).delete();
  return NextResponse.json({ success: true });
}
