import { collections } from "./firebase-admin";

interface SurveyResponses {
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  coffeeStyle: string;
  alcoholPreferences: string[];
  breakfastStyle: string;
  activityLevel: string;
  interestedInRunning: string;
  interestedInGym: string;
  openToContrastTherapy: string;
  interests: string[];
  morningOrNightOwl: string;
  pacePreference: string;
}

interface Place {
  id: string;
  name: string;
  category: string;
  address: string;
  tags: string[];
  menuLink: string | null;
  website: string | null;
}

function getDaysBetween(arrival: string, departure: string): number {
  const ms = new Date(departure).getTime() - new Date(arrival).getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

function scorePlace(place: Place, survey: SurveyResponses): number {
  let score = 0;

  if (place.category === "restaurant_bar") {
    survey.cuisinePreferences.forEach((pref) => {
      if (place.tags.includes(slugify(pref))) score += 2;
    });
    survey.alcoholPreferences.forEach((pref) => {
      if (place.tags.includes(slugify(pref))) score += 1;
    });
  }

  if (survey.activityLevel === "Very active" || survey.activityLevel === "Elite athlete") {
    if (place.tags.includes("active") || place.tags.includes("running") || place.tags.includes("fitness")) {
      score += 3;
    }
  }

  if (survey.interestedInRunning !== "No" && (place.tags.includes("running") || place.tags.includes("trail"))) {
    score += 2;
  }

  if (survey.openToContrastTherapy === "Absolutely" && place.tags.includes("contrast-therapy")) {
    score += 4;
  }

  survey.interests.forEach((interest) => {
    const s = slugify(interest);
    if (place.tags.some((tag) => tag.includes(s) || s.includes(tag))) score += 2;
  });

  if (survey.dietaryRestrictions.includes("Vegetarian") && place.tags.includes("steakhouse")) {
    score -= 10;
  }

  return score;
}

function getTimeSlots(
  morningOrNightOwl: string,
  isArrivalDay: boolean,
  isDepartureDay: boolean
): { label: string; time: string; category: string }[] {
  const isNightOwl = morningOrNightOwl === "Night owl";

  if (isArrivalDay) {
    return [
      { label: "dinner", time: "7:00 PM", category: "food" },
      { label: "lights_out", time: "10:00 PM", category: "rest" },
    ];
  }

  if (isDepartureDay) {
    return [
      { label: "breakfast", time: isNightOwl ? "9:30 AM" : "8:00 AM", category: "food" },
      { label: "morning_activity", time: isNightOwl ? "11:00 AM" : "10:00 AM", category: "activity" },
      { label: "departure", time: "12:00 PM", category: "rest" },
    ];
  }

  if (isNightOwl) {
    return [
      { label: "coffee", time: "9:30 AM", category: "food" },
      { label: "mid_morning_activity", time: "11:00 AM", category: "activity" },
      { label: "lunch", time: "1:00 PM", category: "food" },
      { label: "afternoon_activity", time: "3:00 PM", category: "activity" },
      { label: "dinner", time: "7:30 PM", category: "food" },
      { label: "evening_activity", time: "9:30 PM", category: "activity" },
      { label: "lights_out", time: "11:30 PM", category: "rest" },
    ];
  }

  return [
    { label: "morning_activity", time: "7:30 AM", category: "activity" },
    { label: "breakfast", time: "9:00 AM", category: "food" },
    { label: "mid_morning_activity", time: "10:30 AM", category: "activity" },
    { label: "lunch", time: "12:30 PM", category: "food" },
    { label: "afternoon_activity", time: "2:30 PM", category: "activity" },
    { label: "dinner", time: "6:30 PM", category: "food" },
    { label: "evening_activity", time: "8:30 PM", category: "activity" },
    { label: "lights_out", time: "10:30 PM", category: "rest" },
  ];
}

function pickPlace(
  places: Place[],
  slotCategory: string,
  survey: SurveyResponses,
  usedIds: Set<string>
): Place | null {
  const categoryMap: Record<string, string[]> = {
    food: ["restaurant_bar", "coffee_breakfast"],
    activity: ["outdoor", "fitness", "culture"],
    rest: [],
  };
  const allowed = categoryMap[slotCategory] || [];

  return (
    places
      .filter((p) => !usedIds.has(p.id) && (allowed.length === 0 || allowed.includes(p.category)))
      .sort((a, b) => scorePlace(b, survey) - scorePlace(a, survey))[0] || null
  );
}

function genericBlock(label: string): { eventName: string; locationName: string; address: string } {
  const map: Record<string, { eventName: string; locationName: string; address: string }> = {
    lights_out: {
      eventName: "Lights Out",
      locationName: "Your Accommodations",
      address: "Mariemont, OH 45227",
    },
    departure: {
      eventName: "Safe Travels — Farewell from Mariemont",
      locationName: "The Open Road",
      address: "Mariemont, OH 45227",
    },
  };
  return map[label] || {
    eventName: "Free Time — Explore the Village",
    locationName: "Mariemont Historic District",
    address: "Wooster Pike, Mariemont, OH 45227",
  };
}

export async function generateItinerary(
  guestId: string,
  survey: SurveyResponses,
  arrivalDate: string,
  departureDate: string
) {
  const placesSnap = await collections.places().get();
  const places: Place[] = placesSnap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Place, "id">),
  }));

  const totalDays = getDaysBetween(arrivalDate, departureDate);
  const usedIds = new Set<string>();
  const now = new Date().toISOString();
  const batch = collections.events().firestore.batch();

  for (let day = 1; day <= totalDays; day++) {
    const slots = getTimeSlots(survey.morningOrNightOwl, day === 1, day === totalDays);
    let sortOrder = 0;

    for (const slot of slots) {
      sortOrder++;

      if (slot.label === "lights_out" || slot.label === "departure") {
        const g = genericBlock(slot.label);
        batch.set(collections.events().doc(), {
          guestId, dayNumber: day, time: slot.time, sortOrder,
          eventName: g.eventName, locationName: g.locationName,
          placeId: null, address: g.address, notes: "", link: null,
          category: "rest", createdAt: now,
        });
        continue;
      }

      const place = pickPlace(places, slot.category, survey, usedIds);

      if (place) {
        usedIds.add(place.id);
        batch.set(collections.events().doc(), {
          guestId, dayNumber: day, time: slot.time, sortOrder,
          eventName: place.name, locationName: place.name,
          placeId: place.id, address: place.address, notes: "",
          link: place.menuLink || place.website || null,
          category: slot.category === "food" ? "food" : "activity",
          createdAt: now,
        });
      } else {
        const g = genericBlock(slot.label);
        batch.set(collections.events().doc(), {
          guestId, dayNumber: day, time: slot.time, sortOrder,
          eventName: g.eventName, locationName: g.locationName,
          placeId: null, address: g.address, notes: "", link: null,
          category: slot.category, createdAt: now,
        });
      }
    }
  }

  await batch.commit();
}
