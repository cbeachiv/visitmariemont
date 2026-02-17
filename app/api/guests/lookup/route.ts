import { NextResponse } from "next/server";
import { collections, slugify } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const slug = slugify(name);

  // Exact slug match
  let snap = await collections.guests().where("slug", "==", slug).limit(1).get();

  // Partial match fallback
  if (snap.empty) {
    snap = await collections
      .guests()
      .where("slug", ">=", slug)
      .where("slug", "<=", slug + "\uf8ff")
      .limit(1)
      .get();
  }

  if (snap.empty) {
    return NextResponse.json({ found: false });
  }

  const doc = snap.docs[0];
  const data = doc.data();

  return NextResponse.json({
    found: true,
    guest: {
      id: doc.id,
      name: data.name,
      slug: data.slug,
      arrivalDate: data.arrivalDate,
      departureDate: data.departureDate,
      surveyCompleted: data.surveyCompleted,
      itineraryPublished: data.itineraryPublished,
    },
  });
}
