import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

try {
  if (!getApps().length && process.env.FIREBASE_PROJECT_ID) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
} catch {
  // Firebase credentials not configured — API routes will be unavailable
}

export const db = getApps().length ? getFirestore() : null as unknown as ReturnType<typeof getFirestore>;
export { Timestamp };

// Collection helpers
export const collections = {
  guests: () => db.collection("guests"),
  places: () => db.collection("places"),
  events: () => db.collection("itinerary_events"),
};

// Convert Firestore doc to plain object with id
export function toDoc<T>(
  snap: FirebaseFirestore.DocumentSnapshot
): T & { id: string } {
  return { id: snap.id, ...(snap.data() as T) };
}

export function toDocs<T>(
  snap: FirebaseFirestore.QuerySnapshot
): (T & { id: string })[] {
  return snap.docs.map((doc) => toDoc<T>(doc));
}

// Slugify helper
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}
