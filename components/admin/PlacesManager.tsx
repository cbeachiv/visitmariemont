"use client";

import { useState } from "react";

interface Place {
  id: string;
  name: string;
  category: string;
  address: string;
  description: string;
  defaultTimeOfDay: string;
  durationMinutes: number;
  tags: string[];
  menuLink: string | null;
  website: string | null;
  adminNotes: string | null;
}

const CATEGORIES = [
  "restaurant_bar",
  "coffee_breakfast",
  "outdoor",
  "fitness",
  "culture",
];
const TIMES = ["morning", "afternoon", "evening", "anytime"];

const categoryLabels: Record<string, string> = {
  restaurant_bar: "Restaurant & Bar",
  coffee_breakfast: "Coffee & Breakfast",
  outdoor: "Outdoor Activity",
  fitness: "Fitness",
  culture: "Culture",
};

interface PlacesManagerProps {
  initialPlaces: Place[];
}

const emptyForm = {
  name: "",
  category: "restaurant_bar",
  address: "",
  description: "",
  defaultTimeOfDay: "anytime",
  durationMinutes: 60,
  tags: "",
  menuLink: "",
  website: "",
  adminNotes: "",
};

export default function PlacesManager({ initialPlaces }: PlacesManagerProps) {
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  function setField<K extends keyof typeof emptyForm>(
    k: K,
    v: (typeof emptyForm)[K]
  ) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function startEdit(place: Place) {
    setEditingId(place.id);
    setAdding(false);
    setForm({
      name: place.name,
      category: place.category,
      address: place.address,
      description: place.description,
      defaultTimeOfDay: place.defaultTimeOfDay,
      durationMinutes: place.durationMinutes,
      tags: place.tags.join(", "),
      menuLink: place.menuLink || "",
      website: place.website || "",
      adminNotes: place.adminNotes || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setAdding(false);
    setForm(emptyForm);
  }

  async function savePlace(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      durationMinutes: Number(form.durationMinutes),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      menuLink: form.menuLink || null,
      website: form.website || null,
      adminNotes: form.adminNotes || null,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/places/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setPlaces((prev) =>
            prev.map((p) => (p.id === editingId ? updated : p))
          );
          cancelEdit();
        }
      } else {
        const res = await fetch("/api/places", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const place = await res.json();
          setPlaces((prev) => [...prev, place]);
          cancelEdit();
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function deletePlace(id: string) {
    if (!confirm("Delete this place?")) return;
    await fetch(`/api/places/${id}`, { method: "DELETE" });
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered =
    filter === "all" ? places : places.filter((p) => p.category === filter);

  const PlaceForm = () => (
    <form
      onSubmit={savePlace}
      className="bg-stone-50 border border-stone-200 rounded-xl p-5 mb-6"
    >
      <h3 className="font-body font-semibold text-stone-700 mb-4">
        {editingId ? "Edit Place" : "New Place"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="Place name"
          required
          className="px-4 py-3 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
        />
        <select
          value={form.category}
          onChange={(e) => setField("category", e.target.value)}
          className="px-4 py-3 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c]}
            </option>
          ))}
        </select>
        <input
          value={form.address}
          onChange={(e) => setField("address", e.target.value)}
          placeholder="Address"
          required
          className="px-4 py-3 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618] md:col-span-2"
        />
        <textarea
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Description (shown to guests)"
          rows={2}
          className="px-4 py-3 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618] md:col-span-2 resize-none"
        />
        <select
          value={form.defaultTimeOfDay}
          onChange={(e) => setField("defaultTimeOfDay", e.target.value)}
          className="px-4 py-3 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
        >
          {TIMES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={form.durationMinutes}
          onChange={(e) =>
            setField("durationMinutes", parseInt(e.target.value) || 60)
          }
          placeholder="Duration (minutes)"
          className="px-4 py-3 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
        />
        <input
          value={form.tags}
          onChange={(e) => setField("tags", e.target.value)}
          placeholder="Tags (comma-separated): casual, italian, active"
          className="px-4 py-3 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618] md:col-span-2"
        />
        <input
          value={form.menuLink}
          onChange={(e) => setField("menuLink", e.target.value)}
          placeholder="Menu link (optional)"
          className="px-4 py-3 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
        />
        <input
          value={form.website}
          onChange={(e) => setField("website", e.target.value)}
          placeholder="Website (optional)"
          className="px-4 py-3 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
        />
        <textarea
          value={form.adminNotes}
          onChange={(e) => setField("adminNotes", e.target.value)}
          placeholder="Private admin notes (not shown to guests)"
          rows={2}
          className="px-4 py-3 border border-amber-100 bg-amber-50/30 rounded-lg font-body text-sm focus:outline-none focus:border-amber-300 md:col-span-2 resize-none"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#0b2618] text-white rounded-lg font-body font-semibold text-sm disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Place"}
        </button>
        <button
          type="button"
          onClick={cancelEdit}
          className="px-5 py-2.5 border border-stone-200 text-stone-600 rounded-lg font-body font-semibold text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-[#0b2618] text-2xl font-bold">
          Places Database
        </h2>
        <button
          onClick={() => {
            setAdding(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="px-5 py-2.5 bg-[#0b2618] text-white rounded-lg font-body font-semibold text-sm hover:bg-[#1a3d26] transition-colors"
        >
          + Add Place
        </button>
      </div>

      {/* Add form */}
      {adding && <PlaceForm />}

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full font-body text-xs font-semibold transition-colors ${
            filter === "all"
              ? "bg-[#0b2618] text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          All ({places.length})
        </button>
        {CATEGORIES.map((c) => {
          const count = places.filter((p) => p.category === c).length;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full font-body text-xs font-semibold transition-colors ${
                filter === c
                  ? "bg-[#0b2618] text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {categoryLabels[c]} ({count})
            </button>
          );
        })}
      </div>

      {/* Edit form */}
      {editingId && <PlaceForm />}

      {/* Places list */}
      <div className="space-y-3">
        {filtered.map((place) => (
          <div
            key={place.id}
            className="bg-white border border-stone-200 rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-body font-bold text-stone-900">
                    {place.name}
                  </p>
                  <span className="text-xs font-body bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                    {categoryLabels[place.category]}
                  </span>
                  <span className="text-xs font-body bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                    {place.defaultTimeOfDay}
                  </span>
                </div>
                <p className="font-body text-stone-500 text-sm mb-1">
                  {place.address}
                </p>
                {place.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {place.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-body bg-[#78ddaa]/20 text-[#0b2618] px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => startEdit(place)}
                  className="px-3 py-1.5 border border-stone-200 text-stone-600 rounded-md font-body text-xs font-semibold hover:bg-stone-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePlace(place.id)}
                  className="px-3 py-1.5 border border-red-200 text-red-500 rounded-md font-body text-xs font-semibold hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
