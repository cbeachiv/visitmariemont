"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SurveyForm from "@/components/survey/SurveyForm";

interface GuestInfo {
  id: string;
  name: string;
  slug: string;
  arrivalDate: string;
  departureDate: string;
  surveyCompleted: boolean;
  itineraryPublished: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function VisitPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") || "";

  const [name, setName] = useState(initialName);
  const [searching, setSearching] = useState(false);
  const [guest, setGuest] = useState<GuestInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [surveyDone, setSurveyDone] = useState(false);

  async function lookup(searchName: string) {
    if (!searchName.trim()) return;
    setSearching(true);
    setNotFound(false);
    setGuest(null);

    try {
      const res = await fetch(
        `/api/guests/lookup?name=${encodeURIComponent(searchName)}`
      );
      const data = await res.json();

      if (!data.found) {
        setNotFound(true);
        return;
      }

      const g: GuestInfo = data.guest;

      // If published, redirect to itinerary
      if (g.itineraryPublished) {
        router.push(`/visit/${g.slug}`);
        return;
      }

      setGuest(g);
    } finally {
      setSearching(false);
    }
  }

  useEffect(() => {
    if (initialName) {
      lookup(initialName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Survey complete state
  if (surveyDone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#f7f4ef]">
        <div className="max-w-lg text-center">
          <div className="text-6xl mb-6">🏛️</div>
          <h1 className="font-heading text-[#0b2618] text-4xl font-bold mb-4">
            Survey Received.
          </h1>
          <p className="font-body text-stone-600 text-lg mb-4 leading-relaxed">
            Your preferences have been received by the{" "}
            <em>Mariemont Bureau of Visitor Affairs</em> and are being
            processed with the utmost care.
          </p>
          <p className="font-body text-stone-500 text-base mb-8">
            Your official itinerary is now being prepared. Check back here
            soon — or your host will let you know when it&apos;s ready.
          </p>
          <div className="bg-[#0b2618]/5 border border-[#0b2618]/10 rounded-xl p-6">
            <p className="font-heading text-[#0b2618] text-lg font-semibold italic">
              &ldquo;The Bureau thanks you for your cooperation. You have made
              an excellent decision in visiting Mariemont.&rdquo;
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Survey form state
  if (guest && !guest.surveyCompleted) {
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        {/* Header */}
        <div className="bg-[#0b2618] text-white px-6 py-8 text-center">
          <p className="font-body text-[#78ddaa] text-xs tracking-widest uppercase mb-2">
            Mariemont Bureau of Visitor Affairs
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            Welcome, {guest.name}!
          </h1>
          <p className="font-body text-white/70 text-base">
            {formatDate(guest.arrivalDate)} → {formatDate(guest.departureDate)}
          </p>
          <p className="font-body text-white/50 text-sm mt-2">
            Complete your preference survey so we can prepare your official
            itinerary.
          </p>
        </div>
        <SurveyForm
          guestId={guest.id}
          guestName={guest.name}
          onComplete={() => setSurveyDone(true)}
        />
      </div>
    );
  }

  // Survey already done but itinerary not published
  if (guest && guest.surveyCompleted && !guest.itineraryPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#f7f4ef]">
        <div className="max-w-lg text-center">
          <div className="text-6xl mb-6">⏳</div>
          <h1 className="font-heading text-[#0b2618] text-4xl font-bold mb-4">
            Your Itinerary is Being Prepared
          </h1>
          <p className="font-body text-stone-600 text-lg leading-relaxed">
            The <em>Bureau of Visitor Affairs</em> is currently adding
            personal touches to your itinerary. This involves jokes, fines,
            and an unreasonable amount of care.
          </p>
          <p className="font-body text-stone-500 text-base mt-4">
            Check back soon, or your host will notify you when it&apos;s ready.
          </p>
        </div>
      </div>
    );
  }

  // Lookup form (default)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#f7f4ef]">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block border border-[#0b2618]/20 rounded-full px-4 py-2 mb-6">
            <span className="font-body text-[#0b2618] text-xs tracking-widest uppercase">
              Guest Check-In
            </span>
          </div>
          <h1 className="font-heading text-[#0b2618] text-4xl font-bold mb-3">
            Look Up Your Visit
          </h1>
          <p className="font-body text-stone-500 text-base">
            Enter your name and we&apos;ll pull up your visit details.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookup(name);
          }}
          className="space-y-4"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name…"
            className="w-full px-5 py-4 rounded-xl border-2 border-stone-200 bg-white font-body text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#0b2618] text-lg"
          />
          <button
            type="submit"
            disabled={searching}
            className="w-full py-4 bg-[#0b2618] text-white rounded-xl font-body font-bold text-lg hover:bg-[#1a3d26] transition-colors disabled:opacity-60"
          >
            {searching ? "Looking you up…" : "Find My Visit →"}
          </button>
        </form>

        {/* Not found message */}
        {notFound && (
          <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="font-body text-amber-800 text-sm">
              <strong>Hmm, we don&apos;t have you on the books yet.</strong>
              <br />
              Ask your host to get you set up — or double-check the spelling.
            </p>
          </div>
        )}

        {/* Back to home */}
        <p className="font-body text-stone-400 text-sm text-center mt-8">
          <a href="/" className="hover:text-[#0b2618] transition-colors">
            ← Back to Visit Mariemont
          </a>
        </p>
      </div>
    </div>
  );
}

export default function VisitPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f7f4ef]">
        <div className="font-body text-stone-400">Loading…</div>
      </div>
    }>
      <VisitPageContent />
    </Suspense>
  );
}
