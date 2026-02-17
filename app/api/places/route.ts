import { NextResponse } from "next/server";
import { collections, toDocs } from "@/lib/firebase-admin";

export async function GET() {
  const snap = await collections.places().orderBy("name").get();
  return NextResponse.json(toDocs(snap));
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, category, address } = body;

  if (!name || !category || !address) {
    return NextResponse.json(
      { error: "name, category, and address are required" },
      { status: 400 }
    );
  }

  const data = {
    name,
    category,
    address,
    description: body.description || "",
    defaultTimeOfDay: body.defaultTimeOfDay || "anytime",
    durationMinutes: Number(body.durationMinutes) || 60,
    tags: Array.isArray(body.tags)
      ? body.tags
      : (body.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
    menuLink: body.menuLink || null,
    website: body.website || null,
    adminNotes: body.adminNotes || null,
    createdAt: new Date().toISOString(),
  };

  const ref = await collections.places().add(data);
  return NextResponse.json({ id: ref.id, ...data }, { status: 201 });
}
