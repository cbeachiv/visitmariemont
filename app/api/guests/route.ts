import { NextResponse } from "next/server";
import { collections, slugify, toDocs } from "@/lib/firebase-admin";

export async function GET() {
  const snap = await collections.guests().orderBy("createdAt", "desc").get();
  const guests = toDocs(snap);
  return NextResponse.json(guests);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, arrivalDate, departureDate } = body;

  if (!name || !arrivalDate || !departureDate) {
    return NextResponse.json(
      { error: "name, arrivalDate, and departureDate are required" },
      { status: 400 }
    );
  }

  const slug = slugify(name);

  const existing = await collections.guests().where("slug", "==", slug).get();
  if (!existing.empty) {
    return NextResponse.json(
      { error: "A guest with this name already exists" },
      { status: 409 }
    );
  }

  const now = new Date().toISOString();
  const ref = await collections.guests().add({
    name,
    slug,
    arrivalDate,
    departureDate,
    surveyCompleted: false,
    surveyResponses: null,
    itineraryPublished: false,
    createdAt: now,
  });

  const doc = await ref.get();
  return NextResponse.json({ id: ref.id, ...doc.data() }, { status: 201 });
}
