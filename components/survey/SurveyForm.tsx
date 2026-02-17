"use client";

import { useState } from "react";

interface SurveyFormProps {
  guestId: string;
  guestName: string;
  onComplete: () => void;
}

type Answers = {
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
};

const defaultAnswers: Answers = {
  dietaryRestrictions: [],
  cuisinePreferences: [],
  coffeeStyle: "",
  alcoholPreferences: [],
  breakfastStyle: "",
  activityLevel: "",
  interestedInRunning: "",
  interestedInGym: "",
  openToContrastTherapy: "",
  interests: [],
  morningOrNightOwl: "",
  pacePreference: "",
};

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded-xl border-2 font-body text-sm transition-all duration-150 text-left ${
        selected
          ? "border-[#0b2618] bg-[#0b2618] text-white"
          : "border-stone-200 bg-white text-stone-700 hover:border-[#0b2618]/50"
      }`}
    >
      {label}
    </button>
  );
}

function MultiSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]
    );
  };
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <OptionButton
          key={opt}
          label={opt}
          selected={value.includes(opt)}
          onClick={() => toggle(opt)}
        />
      ))}
    </div>
  );
}

function SingleSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <OptionButton
          key={opt}
          label={opt}
          selected={value === opt}
          onClick={() => onChange(opt)}
        />
      ))}
    </div>
  );
}

const steps = [
  {
    title: "Food & Drink",
    subtitle: "Let's make sure you eat well.",
    emoji: "🍽️",
  },
  {
    title: "Activity Level",
    subtitle: "How hard do you want to work?",
    emoji: "🏃",
  },
  {
    title: "Interests & Vibes",
    subtitle: "What kind of trip is this?",
    emoji: "✨",
  },
];

export default function SurveyForm({
  guestId,
  guestName,
  onComplete,
}: SurveyFormProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(defaultAnswers);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId, surveyResponses: answers }),
      });
      if (res.ok) {
        onComplete();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-bold transition-colors ${
                i <= step
                  ? "bg-[#0b2618] text-white"
                  : "bg-stone-200 text-stone-400"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 ${i < step ? "bg-[#0b2618]" : "bg-stone-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step header */}
      <div className="mb-8">
        <span className="text-3xl mb-2 block">{steps[step].emoji}</span>
        <h2 className="font-heading text-[#0b2618] text-3xl font-bold mb-1">
          {steps[step].title}
        </h2>
        <p className="font-body text-stone-500">{steps[step].subtitle}</p>
      </div>

      {/* Step 0 — Food & Drink */}
      {step === 0 && (
        <div className="space-y-8">
          <div>
            <label className="font-body font-semibold text-stone-700 block mb-3">
              Any dietary restrictions?
            </label>
            <MultiSelect
              options={[
                "No restrictions",
                "Vegetarian",
                "Vegan",
                "Gluten-free",
                "Other",
              ]}
              value={answers.dietaryRestrictions}
              onChange={(v) => set("dietaryRestrictions", v)}
            />
          </div>
          <div>
            <label className="font-body font-semibold text-stone-700 block mb-3">
              Cuisine preferences?
            </label>
            <MultiSelect
              options={[
                "American",
                "Italian",
                "Mexican",
                "Asian",
                "I&apos;ll eat anything",
              ]}
              value={answers.cuisinePreferences}
              onChange={(v) => set("cuisinePreferences", v)}
            />
          </div>
          <div>
            <label className="font-body font-semibold text-stone-700 block mb-3">
              Coffee situation?
            </label>
            <SingleSelect
              options={["Yes — black", "Yes — fancy drinks", "No thanks"]}
              value={answers.coffeeStyle}
              onChange={(v) => set("coffeeStyle", v)}
            />
          </div>
          <div>
            <label className="font-body font-semibold text-stone-700 block mb-3">
              Alcohol preferences?
            </label>
            <MultiSelect
              options={["Beer", "Wine", "Cocktails", "Non-drinker"]}
              value={answers.alcoholPreferences}
              onChange={(v) => set("alcoholPreferences", v)}
            />
          </div>
          <div>
            <label className="font-body font-semibold text-stone-700 block mb-3">
              Breakfast style?
            </label>
            <SingleSelect
              options={[
                "Big sit-down breakfast",
                "Quick coffee & pastry",
                "I&apos;ll sleep through it",
              ]}
              value={answers.breakfastStyle}
              onChange={(v) => set("breakfastStyle", v)}
            />
          </div>
        </div>
      )}

      {/* Step 1 — Activity Level */}
      {step === 1 && (
        <div className="space-y-8">
          <div>
            <label className="font-body font-semibold text-stone-700 block mb-3">
              General activity level?
            </label>
            <SingleSelect
              options={[
                "Couch potato",
                "Moderately active",
                "Very active",
                "Elite athlete",
              ]}
              value={answers.activityLevel}
              onChange={(v) => set("activityLevel", v)}
            />
          </div>
          <div>
            <label className="font-body font-semibold text-stone-700 block mb-3">
              Interested in running/jogging routes?
            </label>
            <SingleSelect
              options={["Yes — casual jog", "Yes — serious run", "No"]}
              value={answers.interestedInRunning}
              onChange={(v) => set("interestedInRunning", v)}
            />
          </div>
          <div>
            <label className="font-body font-semibold text-stone-700 block mb-3">
              Interested in gym/fitness activities?
            </label>
            <SingleSelect
              options={["Yes", "No"]}
              value={answers.interestedInGym}
              onChange={(v) => set("interestedInGym", v)}
            />
          </div>
          <div>
            <label className="font-body font-semibold text-stone-700 block mb-3">
              Open to contrast therapy (cold plunge, sauna)?
            </label>
            <SingleSelect
              options={["Absolutely", "Maybe", "Hard no"]}
              value={answers.openToContrastTherapy}
              onChange={(v) => set("openToContrastTherapy", v)}
            />
          </div>
        </div>
      )}

      {/* Step 2 — Interests & Vibes */}
      {step === 2 && (
        <div className="space-y-8">
          <div>
            <label className="font-body font-semibold text-stone-700 block mb-3">
              What sounds most appealing?{" "}
              <span className="text-stone-400 font-normal">(pick all that apply)</span>
            </label>
            <MultiSelect
              options={[
                "Local history & architecture",
                "Parks & nature walks",
                "Shopping & browsing",
                "Sports events",
                "Live music/entertainment",
                "Just relaxing",
              ]}
              value={answers.interests}
              onChange={(v) => set("interests", v)}
            />
          </div>
          <div>
            <label className="font-body font-semibold text-stone-700 block mb-3">
              Morning person or night owl?
            </label>
            <SingleSelect
              options={["Morning person", "Night owl", "Depends on the day"]}
              value={answers.morningOrNightOwl}
              onChange={(v) => set("morningOrNightOwl", v)}
            />
          </div>
          <div>
            <label className="font-body font-semibold text-stone-700 block mb-3">
              Pace preference?
            </label>
            <SingleSelect
              options={[
                "Pack every hour with activities",
                "Leisurely with lots of downtime",
                "Mix of both",
              ]}
              value={answers.pacePreference}
              onChange={(v) => set("pacePreference", v)}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4 mt-10">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 py-4 border-2 border-stone-300 rounded-xl font-body font-semibold text-stone-600 hover:border-stone-400 transition-colors"
          >
            ← Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 py-4 bg-[#0b2618] text-white rounded-xl font-body font-bold hover:bg-[#1a3d26] transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-4 bg-[#78ddaa] text-[#0b2618] rounded-xl font-body font-bold hover:bg-[#5ec996] transition-colors disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit My Preferences →"}
          </button>
        )}
      </div>

      {/* Guest name display */}
      <p className="font-body text-stone-400 text-sm text-center mt-6">
        Completing survey for{" "}
        <span className="text-stone-600 font-semibold">{guestName}</span>
      </p>
    </div>
  );
}
