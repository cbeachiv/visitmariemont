"use client";

interface FineTrackerProps {
  events: { notes: string | null }[];
}

function parseFines(notes: string | null): number {
  if (!notes) return 0;
  const matches = notes.match(/\$(\d+(?:\.\d+)?)\s+fine/gi);
  if (!matches) return 0;
  return matches.reduce((sum, m) => {
    const num = parseFloat(m.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
}

export default function FineTracker({ events }: FineTrackerProps) {
  const totalFines = events.reduce(
    (sum, e) => sum + parseFines(e.notes),
    0
  );

  if (totalFines === 0) return null;

  return (
    <div className="mx-6 mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-body text-amber-900 text-xs font-bold tracking-widest uppercase mb-0.5">
            Outstanding Fines
          </p>
          <p className="font-body text-amber-700 text-xs">
            As assessed by the Bureau of Visitor Affairs
          </p>
        </div>
        <div className="text-right">
          <p className="font-heading text-amber-900 text-3xl font-bold">
            ${totalFines.toFixed(2)}
          </p>
          <p className="font-body text-amber-600 text-xs">
            (payable in vibes)
          </p>
        </div>
      </div>
    </div>
  );
}
