import EventCard from "./EventCard";

interface Event {
  id: string;
  dayNumber: number;
  time: string;
  eventName: string;
  locationName: string;
  address: string | null;
  notes: string | null;
  link: string | null;
  category: string;
}

interface TimelineProps {
  events: Event[];
  arrivalDate: string;
}

function getDayLabel(arrivalDate: string, dayNumber: number): string {
  const arrival = new Date(arrivalDate);
  const day = new Date(arrival);
  day.setDate(arrival.getDate() + dayNumber - 1);
  return day.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function Timeline({ events, arrivalDate }: TimelineProps) {
  const days = Array.from(new Set(events.map((e) => e.dayNumber))).sort(
    (a, b) => a - b
  );

  return (
    <div className="px-6 pb-12">
      {days.map((day) => {
        const dayEvents = events.filter((e) => e.dayNumber === day);
        return (
          <div key={day} className="mb-12">
            {/* Day header */}
            <div className="sticky top-0 z-10 bg-[#f7f4ef]/90 backdrop-blur-sm py-4 mb-6 -mx-6 px-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0b2618] text-white flex items-center justify-center font-body font-bold text-sm">
                  {day}
                </div>
                <div>
                  <p className="font-body text-stone-400 text-xs tracking-widest uppercase">
                    Day {day}
                  </p>
                  <p className="font-heading text-[#0b2618] text-lg font-bold">
                    {getDayLabel(arrivalDate, day)}
                  </p>
                </div>
              </div>
            </div>

            {/* Events */}
            <div>
              {dayEvents.map((event, i) => (
                <EventCard
                  key={event.id}
                  time={event.time}
                  eventName={event.eventName}
                  locationName={event.locationName}
                  address={event.address}
                  notes={event.notes}
                  link={event.link}
                  category={event.category}
                  isLast={i === dayEvents.length - 1}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
