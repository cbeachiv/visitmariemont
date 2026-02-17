import { NextResponse } from "next/server";
import { collections } from "@/lib/firebase-admin";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.category !== undefined) updates.category = body.category;
  if (body.address !== undefined) updates.address = body.address;
  if (body.description !== undefined) updates.description = body.description;
  if (body.defaultTimeOfDay !== undefined) updates.defaultTimeOfDay = body.defaultTimeOfDay;
  if (body.durationMinutes !== undefined) updates.durationMinutes = Number(body.durationMinutes);
  if (body.tags !== undefined) {
    updates.tags = Array.isArray(body.tags)
      ? body.tags
      : body.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
  }
  if (body.menuLink !== undefined) updates.menuLink = body.menuLink || null;
  if (body.website !== undefined) updates.website = body.website || null;
  if (body.adminNotes !== undefined) updates.adminNotes = body.adminNotes || null;

  await collections.places().doc(id).update(updates);
  const doc = await collections.places().doc(id).get();
  return NextResponse.json({ id: doc.id, ...doc.data() });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await collections.places().doc(id).delete();
  return NextResponse.json({ success: true });
}
