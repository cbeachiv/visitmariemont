"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ItineraryEvent {
  id: string;
  dayNumber: number;
  time: string;
  sortOrder: number;
  eventName: string;
  locationName: string;
  address: string | null;
  notes: string | null;
  link: string | null;
  category: string;
}

interface Place {
  id: string;
  name: string;
  category: string;
  address: string;
}

interface ItineraryEditorProps {
  guestId: string;
  guestName: string;
  guestSlug: string;
  initialEvents: ItineraryEvent[];
  places: Place[];
  published: boolean;
}

const CATEGORIES = ["food", "activity", "fitness", "culture", "rest", "custom"];

function SortableEvent({
  event,
  onUpdate,
  onDelete,
}: {
  event: ItineraryEvent;
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing flex-shrink-0"
          aria-label="Drag to reorder"
        >
          ⠿
        </button>

        <div className="flex-1 space-y-3">
          {/* Row 1: Time, Category */}
          <div className="flex gap-3">
            <input
              value={event.time}
              onChange={(e) => onUpdate(event.id, "time", e.target.value)}
              className="w-28 px-3 py-2 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
              placeholder="8:00 PM"
            />
            <select
              value={event.category}
              onChange={(e) => onUpdate(event.id, "category", e.target.value)}
              className="px-3 py-2 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Row 2: Event name */}
          <input
            value={event.eventName}
            onChange={(e) => onUpdate(event.id, "eventName", e.target.value)}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg font-body text-sm font-semibold focus:outline-none focus:border-[#0b2618]"
            placeholder="Event name (make it fun)"
          />

          {/* Row 3: Location, address */}
          <div className="flex gap-3">
            <input
              value={event.locationName}
              onChange={(e) =>
                onUpdate(event.id, "locationName", e.target.value)
              }
              className="flex-1 px-3 py-2 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
              placeholder="Location name"
            />
            <input
              value={event.address || ""}
              onChange={(e) => onUpdate(event.id, "address", e.target.value)}
              className="flex-1 px-3 py-2 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
              placeholder="Address"
            />
          </div>

          {/* Row 4: Notes (the fun part!) */}
          <textarea
            value={event.notes || ""}
            onChange={(e) => onUpdate(event.id, "notes", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg font-body text-sm focus:outline-none focus:border-amber-400 bg-amber-50/50 resize-none"
            placeholder="Add jokes, fines, or commentary here... e.g. '$5 fine for arriving late'"
          />

          {/* Row 5: Link */}
          <input
            value={event.link || ""}
            onChange={(e) => onUpdate(event.id, "link", e.target.value)}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
            placeholder="Menu link or website (optional)"
          />
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(event.id)}
          className="text-stone-300 hover:text-red-400 transition-colors flex-shrink-0 mt-1"
          title="Remove event"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function ItineraryEditor({
  guestId,
  guestName,
  guestSlug,
  initialEvents,
  places,
  published: initialPublished,
}: ItineraryEditorProps) {
  const [events, setEvents] = useState<ItineraryEvent[]>(initialEvents);
  const [published, setPublished] = useState(initialPublished);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const days = Array.from(new Set(events.map((e) => e.dayNumber))).sort(
    (a, b) => a - b
  );

  function handleDragEnd(event: DragEndEvent, dayNumber: number) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const dayEvents = events.filter((e) => e.dayNumber === dayNumber);
    const oldIndex = dayEvents.findIndex((e) => e.id === active.id);
    const newIndex = dayEvents.findIndex((e) => e.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(dayEvents, oldIndex, newIndex).map((e, i) => ({
      ...e,
      sortOrder: i + 1,
    }));

    setEvents((prev) => [
      ...prev.filter((e) => e.dayNumber !== dayNumber),
      ...reordered,
    ]);
  }

  const updateEvent = useCallback(
    (id: string, field: string, value: string) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
      );
    },
    []
  );

  async function deleteEvent(id: string) {
    await fetch(`/api/itinerary/${guestId}?eventId=${id}`, {
      method: "DELETE",
    });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  async function addEvent(dayNumber: number) {
    const res = await fetch(`/api/itinerary/${guestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new: true, dayNumber }),
    });
    if (res.ok) {
      const event = await res.json();
      setEvents((prev) => [...prev, event]);
    }
  }

  async function saveAll() {
    setSaving(true);
    try {
      // Save each event update
      await Promise.all(
        events.map((e) =>
          fetch(`/api/itinerary/${guestId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: e.id,
              time: e.time,
              eventName: e.eventName,
              locationName: e.locationName,
              address: e.address,
              notes: e.notes,
              link: e.link,
              category: e.category,
              sortOrder: e.sortOrder,
            }),
          })
        )
      );
      setSavedAt(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  }

  async function publishItinerary() {
    if (
      !confirm(
        `Publish ${guestName}'s itinerary? They'll be able to view it at /visit/${guestSlug}.`
      )
    )
      return;

    setPublishing(true);
    await saveAll();
    const res = await fetch(`/api/guests/${guestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itineraryPublished: true }),
    });
    if (res.ok) {
      setPublished(true);
    }
    setPublishing(false);
  }

  return (
    <div>
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-stone-200 px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-body text-stone-500 text-xs">Editing itinerary for</p>
          <p className="font-heading text-[#0b2618] text-xl font-bold">
            {guestName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && (
            <p className="font-body text-stone-400 text-xs">
              Saved at {savedAt}
            </p>
          )}
          <button
            onClick={saveAll}
            disabled={saving}
            className="px-5 py-2.5 border-2 border-[#0b2618] text-[#0b2618] rounded-lg font-body font-semibold text-sm hover:bg-[#0b2618]/5 transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {published ? (
            <a
              href={`/visit/${guestSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-body font-semibold text-sm hover:bg-green-700 transition-colors"
            >
              ✓ Published — View →
            </a>
          ) : (
            <button
              onClick={publishItinerary}
              disabled={publishing}
              className="px-5 py-2.5 bg-[#78ddaa] text-[#0b2618] rounded-lg font-body font-bold text-sm hover:bg-[#5ec996] transition-colors disabled:opacity-60"
            >
              {publishing ? "Publishing…" : "Publish Itinerary →"}
            </button>
          )}
        </div>
      </div>

      {/* Days */}
      <div className="p-6 space-y-10">
        {days.map((day) => {
          const dayEvents = events
            .filter((e) => e.dayNumber === day)
            .sort((a, b) => a.sortOrder - b.sortOrder);

          return (
            <div key={day}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-[#0b2618] text-xl font-bold">
                  Day {day}
                </h3>
                <button
                  onClick={() => addEvent(day)}
                  className="text-[#0b2618] font-body text-sm font-semibold hover:text-[#2f3e36] transition-colors"
                >
                  + Add Event
                </button>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(e) => handleDragEnd(e, day)}
              >
                <SortableContext
                  items={dayEvents.map((e) => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {dayEvents.map((event) => (
                      <SortableEvent
                        key={event.id}
                        event={event}
                        onUpdate={updateEvent}
                        onDelete={deleteEvent}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="text-center py-16">
            <p className="font-body text-stone-400 text-base">
              No events yet. The guest needs to complete their survey first, or
              add events manually.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
