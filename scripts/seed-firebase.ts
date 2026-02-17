/**
 * Seed script — populates Firestore with Mariemont places.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-firebase.ts
 *
 * Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env
 */

import * as dotenv from "dotenv";
dotenv.config();

import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);

const places = [
  // Restaurants & Bars
  {
    name: "Mariemont Inn Restaurant",
    category: "restaurant_bar",
    address: "6880 Wooster Pike, Cincinnati, OH 45227",
    description: "The crown jewel of Mariemont dining. Classic American cuisine in a Tudor-style inn with old-world charm and a proper bar.",
    defaultTimeOfDay: "evening",
    durationMinutes: 90,
    tags: ["american", "upscale", "dinner", "bar", "date-night"],
    menuLink: null,
    website: "https://mariemontinn.com",
    adminNotes: "Great for a nice dinner. Reserve ahead on weekends.",
  },
  {
    name: "Skyline Chili",
    category: "restaurant_bar",
    address: "7745 Beechmont Ave, Cincinnati, OH 45255",
    description: "The Cincinnati rite of passage. Chili on spaghetti. Cheese on top. You will either love it or we can't be friends.",
    defaultTimeOfDay: "afternoon",
    durationMinutes: 45,
    tags: ["american", "casual", "lunch", "cincinnati-classic", "must-try"],
    menuLink: null,
    website: "https://skylinechili.com",
    adminNotes: "Order a 3-way. Non-negotiable.",
  },
  {
    name: "LaRosa's Pizzeria",
    category: "restaurant_bar",
    address: "7002 Wooster Pike, Cincinnati, OH 45227",
    description: "Cincinnati's beloved local pizza chain. Thin crust, sweet sauce, extremely dangerous levels of cheese.",
    defaultTimeOfDay: "evening",
    durationMinutes: 60,
    tags: ["italian", "pizza", "casual", "family", "dinner"],
    menuLink: null,
    website: "https://larosas.com",
    adminNotes: "Get the pepperoni. Classic.",
  },
  {
    name: "Mac's Pizza Pub",
    category: "restaurant_bar",
    address: "1019 Delta Ave, Cincinnati, OH 45208",
    description: "Neighborhood pizza pub with cold beer, great pies, and the kind of vibe that makes you stay for one more round.",
    defaultTimeOfDay: "evening",
    durationMinutes: 75,
    tags: ["pizza", "bar", "casual", "dinner", "beer"],
    menuLink: null,
    website: null,
    adminNotes: "Fun neighborhood bar. Good for a laid-back night.",
  },
  {
    name: "Mio's Pizzeria",
    category: "restaurant_bar",
    address: "6905 Wooster Pike, Cincinnati, OH 45227",
    description: "Local favorite for New York-style pizza slices and a relaxed atmosphere right in the village.",
    defaultTimeOfDay: "afternoon",
    durationMinutes: 45,
    tags: ["pizza", "italian", "casual", "lunch", "quick"],
    menuLink: null,
    website: null,
    adminNotes: "Great quick lunch option.",
  },
  {
    name: "The Precinct",
    category: "restaurant_bar",
    address: "311 Delta Ave, Cincinnati, OH 45226",
    description: "Cincinnati's legendary steakhouse. A true institution. Bring an appetite and maybe a second belt.",
    defaultTimeOfDay: "evening",
    durationMinutes: 120,
    tags: ["steakhouse", "upscale", "dinner", "american", "special-occasion"],
    menuLink: null,
    website: "https://theprecinctrestaurant.com",
    adminNotes: "Save for a special occasion dinner. Worth every penny.",
  },

  // Coffee & Breakfast
  {
    name: "Mariemont Inn Breakfast",
    category: "coffee_breakfast",
    address: "6880 Wooster Pike, Cincinnati, OH 45227",
    description: "A proper sit-down breakfast in the historic inn. Start your day feeling like a distinguished guest of the village.",
    defaultTimeOfDay: "morning",
    durationMinutes: 60,
    tags: ["breakfast", "sit-down", "american", "upscale"],
    menuLink: null,
    website: "https://mariemontinn.com",
    adminNotes: "Eggs Benedict is excellent.",
  },
  {
    name: "Graeter's Ice Cream",
    category: "coffee_breakfast",
    address: "6980 Wooster Pike, Cincinnati, OH 45227",
    description: "Cincinnati's legendary small-batch French pot ice cream. The black raspberry chip is a religious experience.",
    defaultTimeOfDay: "anytime",
    durationMinutes: 30,
    tags: ["dessert", "casual", "quick", "must-try", "cincinnati-classic"],
    menuLink: null,
    website: "https://graeters.com",
    adminNotes: "Black raspberry chip. No debate. Don't ask questions.",
  },
  {
    name: "Coffee Emporium",
    category: "coffee_breakfast",
    address: "3244 Madison Rd, Cincinnati, OH 45209",
    description: "A beloved local Cincinnati coffee shop. Proper espresso, cozy atmosphere, the kind of place you linger.",
    defaultTimeOfDay: "morning",
    durationMinutes: 45,
    tags: ["coffee", "local", "cozy", "morning", "pastry"],
    menuLink: null,
    website: null,
    adminNotes: "Best local coffee in the area.",
  },

  // Outdoor Activities
  {
    name: "Mariemont Historic District Walking Tour",
    category: "outdoor",
    address: "6900 Wooster Pike, Mariemont, OH 45227",
    description: "Stroll through one of America's only planned communities, a National Historic Landmark. Architecture nerds and non-nerds alike will appreciate it.",
    defaultTimeOfDay: "morning",
    durationMinutes: 60,
    tags: ["history", "architecture", "scenic", "walking", "casual"],
    menuLink: null,
    website: "https://mariemont.org",
    adminNotes: "Officially called the 'Mariemont Coastal Cruise' in all itineraries.",
  },
  {
    name: "Dogwood Park",
    category: "outdoor",
    address: "3900 Dogwood Park Dr, Mariemont, OH 45227",
    description: "A quiet neighborhood park perfect for a morning stroll or casual afternoon. The kind of park that makes you want to move here.",
    defaultTimeOfDay: "morning",
    durationMinutes: 45,
    tags: ["nature", "scenic", "casual", "walking", "relaxing"],
    menuLink: null,
    website: null,
    adminNotes: "Great for a slow morning walk.",
  },
  {
    name: "Little Miami Trail",
    category: "outdoor",
    address: "Little Miami Scenic Trail, Milford, OH 45150",
    description: "78 miles of paved trail along a scenic river. Perfect for running, biking, or aggressively walking while pretending to exercise.",
    defaultTimeOfDay: "morning",
    durationMinutes: 90,
    tags: ["active", "running", "biking", "scenic", "nature"],
    menuLink: null,
    website: null,
    adminNotes: "Park at the Milford trailhead. Bring water.",
  },
  {
    name: "South 80 Trails",
    category: "outdoor",
    address: "South 80 Trail, Mariemont, OH 45227",
    description: "75+ acres of wooded trails and community gardens tucked behind the village. A hidden gem for nature lovers.",
    defaultTimeOfDay: "morning",
    durationMinutes: 75,
    tags: ["nature", "hiking", "active", "scenic", "peaceful"],
    menuLink: null,
    website: "https://mariemont.org/lifestyle/south-80-trails/",
    adminNotes: "Trail map available on mariemont.org. Don't get lost.",
  },

  // Fitness
  {
    name: "Cincinnati Sports Mall",
    category: "fitness",
    address: "8580 Colerain Ave, Cincinnati, OH 45251",
    description: "Contrast therapy heaven — cold plunge, sauna, and full gym facilities. The cold plunge is not optional. You'll thank us later.",
    defaultTimeOfDay: "morning",
    durationMinutes: 90,
    tags: ["fitness", "cold-plunge", "sauna", "contrast-therapy", "active"],
    menuLink: null,
    website: null,
    adminNotes: "Book ahead for contrast therapy sessions. Towels provided. Courage not included.",
  },
  {
    name: "Mariemont Racquet Club",
    category: "fitness",
    address: "3838 Plainville Rd, Cincinnati, OH 45227",
    description: "Six regulation tennis courts plus pickleball. A proper game if you think you can keep up.",
    defaultTimeOfDay: "morning",
    durationMinutes: 90,
    tags: ["tennis", "pickleball", "active", "fitness", "sport"],
    menuLink: null,
    website: "https://mariemont.org/lifestyle/racquet-club/",
    adminNotes: "Arrange with the owner to get court access.",
  },

  // Culture
  {
    name: "Mariemont Village Hall & Mayor's Office",
    category: "culture",
    address: "6907 Wooster Pike, Mariemont, OH 45227",
    description: "Seat of Mariemont's civic power. Optional: request an audience with the Mayor. This is more impressive than it sounds.",
    defaultTimeOfDay: "afternoon",
    durationMinutes: 30,
    tags: ["history", "architecture", "culture", "civic"],
    menuLink: null,
    website: "https://mariemont.org",
    adminNotes: "This is the 'Meet the Mayor' stop. The mayor is very real and very important.",
  },
  {
    name: "Mariemont Centennial Concourse",
    category: "culture",
    address: "6800 Wooster Pike, Mariemont, OH 45227",
    description: "The heart of the village — a beautiful community gathering space. Great for people-watching, coffee, and feeling like a local.",
    defaultTimeOfDay: "afternoon",
    durationMinutes: 30,
    tags: ["scenic", "gathering", "culture", "relaxing"],
    menuLink: null,
    website: null,
    adminNotes: "Great photo spot. Village events often here.",
  },
  {
    name: "Mariemont Community Pool",
    category: "culture",
    address: "3812 Plainville Rd, Cincinnati, OH 45227",
    description: "The village pool — a summer institution. Open Memorial Day through Labor Day. Locals take their pool privileges very seriously.",
    defaultTimeOfDay: "afternoon",
    durationMinutes: 120,
    tags: ["swimming", "casual", "summer", "community", "family"],
    menuLink: null,
    website: "https://mariemont.org/lifestyle/swimming/",
    adminNotes: "Summer only. Need guest pass from a member. Ask the owner for access.",
  },
];

async function seed() {
  const col = db.collection("places");

  // Clear existing
  const existing = await col.get();
  const batch = db.batch();
  existing.docs.forEach((d) => batch.delete(d.ref));
  if (!existing.empty) await batch.commit();

  // Insert all
  const insertBatch = db.batch();
  const now = new Date().toISOString();
  for (const place of places) {
    insertBatch.set(col.doc(), { ...place, createdAt: now });
  }
  await insertBatch.commit();

  console.log(`✅ Seeded ${places.length} places into Firestore.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
