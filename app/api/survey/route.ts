import { NextResponse } from "next/server";
import { collections } from "@/lib/firebase-admin";
import { generateItinerary } from "@/lib/itinerary-generator";
import { sendSurveyNotification } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json();
  const { guestId, surveyResponses } = body;

  if (!guestId || !surveyResponses) {
    return NextResponse.json(
      { error: "guestId and surveyResponses are required" },
      { status: 400 }
    );
  }

  const guestDoc = await collections.guests().doc(guestId).get();
  if (!guestDoc.exists) {1
    return NextResponse.json({ error: "Guest not found" }, { status: 404 });
  }

  const guest = { id: guestDoc.id, ...guestDoc.data() } as {
    id: string;
    name: string;
    slug: string;
    arrivalDate: string;
    departureDate: string;
    surveyCompleted: boolean;
    itineraryPublished: boolean;
  };

  if (guest.surveyCompleted) {
    return NextResponse.json({ error: "Survey already completed" }, { status: 409 });
  }

  // Save survey
  await collections.guests().doc(guestId).update({
    surveyCompleted: true,
    surveyResponses,
  });

  // Generate itinerary
  await generateItinerary(guestId, surveyResponses, guest.arrivalDate, guest.departureDate);

  // Send email (non-blocking)
  const topPreferences = [
    surveyResponses.cuisinePreferences?.join(", "),
    surveyResponses.activityLevel,
    surveyResponses.pacePreference,
  ]
    .filter(Boolean)
    .join(" · ");

  sendSurveyNotification({
    guestName: guest.name,
    guestId: guest.id,
    arrivalDate: new Date(guest.arrivalDate).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    departureDate: new Date(guest.departureDate).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    topPreferences,
  }).catch(console.error);

  return NextResponse.json({ success: true });
}
