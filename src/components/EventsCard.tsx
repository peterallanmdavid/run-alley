import { GroupEvent } from "@/lib/data";

export default function EventsCard({
  event,
  handleRemoveEvent,
  formatEventTime,
}: {
  event: GroupEvent;
  handleRemoveEvent?: (id: string) => void;
  formatEventTime: (time: string) => string;
}) {
  return (
    <div key={event.id} className="bg-blue-50 rounded-xl p-4">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-semibold text-gray-900">{event.name}</h4>
      {
        handleRemoveEvent && (
          <button
            onClick={() => handleRemoveEvent(event.id)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        )
      }
    </div>
    <div className="text-sm text-gray-600 space-y-1">
      <p>📍 Location: {event.location}</p>
      <p>🕐 Time: {formatEventTime(event.time)}</p>
      <p>📏 Distance: {event.distance} km</p>
      <div>
        <p className="font-medium">🏃‍♂️ Pace Groups:</p>
        <div className="mt-1">
          {event.paceGroups.map((pace, index) => (
            <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
              {pace}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}