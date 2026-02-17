"use client";

import { useState } from "react";
import Link from "next/link";

interface Guest {
  id: string;
  name: string;
  slug: string;
  arrivalDate: string;
  departureDate: string;
  surveyCompleted: boolean;
  itineraryPublished: boolean;
  createdAt: string;
}

function getStatus(guest: Guest): {
  label: string;
  color: string;
  dot: string;
} {
  const now = new Date();
  const departure = new Date(guest.departureDate);

  if (departure < now) {
    return { label: "Visit Complete", color: "text-stone-400", dot: "bg-stone-300" };
  }
  if (guest.itineraryPublished) {
    return { label: "Published", color: "text-green-700", dot: "bg-green-500" };
  }
  if (guest.surveyCompleted) {
    return { label: "Survey Done — Draft Ready", color: "text-blue-700", dot: "bg-blue-500" };
  }
  return { label: "Awaiting Survey", color: "text-amber-700", dot: "bg-amber-400" };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface GuestTableProps {
  initialGuests: Guest[];
}

export default function GuestTable({ initialGuests }: GuestTableProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [addingGuest, setAddingGuest] = useState(false);
  const [newName, setNewName] = useState("");
  const [newArrival, setNewArrival] = useState("");
  const [newDeparture, setNewDeparture] = useState("");
  const [saving, setSaving] = useState(false);

  async function addGuest(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          arrivalDate: newArrival,
          departureDate: newDeparture,
        }),
      });
      if (res.ok) {
        const guest = await res.json();
        setGuests((prev) => [guest, ...prev]);
        setNewName("");
        setNewArrival("");
        setNewDeparture("");
        setAddingGuest(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteGuest(id: string) {
    if (!confirm("Delete this guest and all their data?")) return;
    await fetch(`/api/guests/${id}`, { method: "DELETE" });
    setGuests((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <div>
      {/* Add guest button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-[#0b2618] text-2xl font-bold">
          Registered Guests
        </h2>
        <button
          onClick={() => setAddingGuest(true)}
          className="px-5 py-2.5 bg-[#0b2618] text-white rounded-lg font-body font-semibold text-sm hover:bg-[#1a3d26] transition-colors"
        >
          + Add Guest
        </button>
      </div>

      {/* Add guest form */}
      {addingGuest && (
        <form
          onSubmit={addGuest}
          className="mb-6 p-5 bg-stone-50 border border-stone-200 rounded-xl"
        >
          <h3 className="font-body font-semibold text-stone-700 mb-4">
            New Guest
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Full name"
              required
              className="px-4 py-3 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
            />
            <input
              type="date"
              value={newArrival}
              onChange={(e) => setNewArrival(e.target.value)}
              required
              className="px-4 py-3 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
            />
            <input
              type="date"
              value={newDeparture}
              onChange={(e) => setNewDeparture(e.target.value)}
              required
              className="px-4 py-3 border border-stone-200 rounded-lg font-body text-sm focus:outline-none focus:border-[#0b2618]"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#0b2618] text-white rounded-lg font-body font-semibold text-sm disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Guest"}
            </button>
            <button
              type="button"
              onClick={() => setAddingGuest(false)}
              className="px-5 py-2.5 border border-stone-200 text-stone-600 rounded-lg font-body font-semibold text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {guests.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-body text-stone-400 text-base">
              No guests yet. Add your first guest above.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5 text-left font-body font-semibold text-stone-500 text-sm">
                  Guest
                </th>
                <th className="px-5 py-3.5 text-left font-body font-semibold text-stone-500 text-sm hidden md:table-cell">
                  Dates
                </th>
                <th className="px-5 py-3.5 text-left font-body font-semibold text-stone-500 text-sm">
                  Status
                </th>
                <th className="px-5 py-3.5 text-right font-body font-semibold text-stone-500 text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {guests.map((guest) => {
                const status = getStatus(guest);
                return (
                  <tr key={guest.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-body font-semibold text-stone-900">
                        {guest.name}
                      </p>
                      <p className="font-body text-stone-400 text-xs">
                        @{guest.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="font-body text-stone-600 text-sm">
                        {formatDate(guest.arrivalDate)} →{" "}
                        {formatDate(guest.departureDate)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${status.dot}`}
                        />
                        <span
                          className={`font-body text-sm font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/guests/${guest.id}`}
                          className="px-3 py-1.5 bg-[#0b2618] text-white rounded-md font-body text-xs font-semibold hover:bg-[#1a3d26] transition-colors"
                        >
                          Edit Itinerary
                        </Link>
                        <button
                          onClick={() => deleteGuest(guest.id)}
                          className="px-3 py-1.5 border border-red-200 text-red-500 rounded-md font-body text-xs font-semibold hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
