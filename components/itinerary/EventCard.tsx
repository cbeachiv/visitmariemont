"use client";

import { motion } from "framer-motion";

interface EventCardProps {
  time: string;
  eventName: string;
  locationName: string;
  address: string | null;
  notes: string | null;
  link: string | null;
  category: string;
  isLast?: boolean;
}

const categoryConfig: Record<
  string,
  { color: string; bg: string; icon: string; label: string }
> = {
  food: {
    color: "text-orange-700",
    bg: "bg-orange-100",
    icon: "🍽️",
    label: "Food & Drink",
  },
  activity: {
    color: "text-blue-700",
    bg: "bg-blue-100",
    icon: "🎯",
    label: "Activity",
  },
  fitness: {
    color: "text-green-700",
    bg: "bg-green-100",
    icon: "💪",
    label: "Fitness",
  },
  culture: {
    color: "text-purple-700",
    bg: "bg-purple-100",
    icon: "🏛️",
    label: "Culture",
  },
  rest: {
    color: "text-stone-500",
    bg: "bg-stone-100",
    icon: "😴",
    label: "Rest",
  },
  custom: {
    color: "text-pink-700",
    bg: "bg-pink-100",
    icon: "⭐",
    label: "Custom",
  },
};

function getMapsLink(address: string) {
  return `https://maps.google.com?q=${encodeURIComponent(address)}`;
}

export default function EventCard({
  time,
  eventName,
  locationName,
  address,
  notes,
  link,
  category,
  isLast,
}: EventCardProps) {
  const isLightsOut =
    eventName.toLowerCase().includes("lights out") ||
    category === "rest";
  const cfg = categoryConfig[category] || categoryConfig.activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative pl-8 pb-8 ${isLast ? "pb-0" : ""}`}
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-3 top-6 bottom-0 w-px bg-stone-200" />
      )}

      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-4 w-6 h-6 rounded-full border-2 border-white shadow flex items-center justify-center text-xs ${
          isLightsOut ? "bg-stone-300" : "bg-[#0b2618]"
        }`}
      />

      {/* Card */}
      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          isLightsOut
            ? "bg-stone-50 border-stone-200 opacity-60"
            : "bg-white border-stone-100"
        }`}
      >
        {/* Time + badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="font-body text-stone-400 text-sm font-medium">{time}</p>
          <span
            className={`text-xs font-body font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} whitespace-nowrap`}
          >
            {cfg.icon} {cfg.label}
          </span>
        </div>

        {/* Event name */}
        <h3
          className={`font-heading text-xl font-bold mb-1 ${
            isLightsOut ? "text-stone-400" : "text-[#0b2618]"
          }`}
        >
          {eventName}
        </h3>

        {/* Location */}
        {locationName && (
          <p className="font-body text-stone-500 text-sm mb-3">
            {address ? (
              <a
                href={getMapsLink(address)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0b2618] underline underline-offset-2 transition-colors"
              >
                📍 {locationName}
              </a>
            ) : (
              <span>📍 {locationName}</span>
            )}
          </p>
        )}

        {/* Notes / jokes / fines */}
        {notes && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="font-body text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">
              {notes}
            </p>
          </div>
        )}

        {/* Link */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 font-body text-sm text-[#0b2618] underline underline-offset-2 hover:text-[#2f3e36] transition-colors"
          >
            View menu / details →
          </a>
        )}
      </div>
    </motion.div>
  );
}
