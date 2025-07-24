import Link from 'next/link';
import { Button } from '@/components';
import { getAllEvents } from '@/lib/supabase-data';
import { GroupEvent } from '@/lib/data';

interface EventWithGroup extends GroupEvent {
  groupName: string;
  groupId: string;
}

const buttonBase = "font-semibold rounded-xl transition duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
const buttonPrimary = "bg-blue-600 hover:bg-blue-700 text-white";
const buttonSuccess = "bg-green-600 hover:bg-green-700 text-white";
const buttonLg = "px-8 py-4 text-lg w-full";

export default async function Home() {
  let events: EventWithGroup[] = [];
  try {
    events = await getAllEvents();
  } catch (error) {
    events = [];
  }

  const formatEventTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Run-Alley</h1>
            <p className="text-gray-600">Connect with runners in your area</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/groups/create">
              <span className={`${buttonBase} ${buttonPrimary} ${buttonLg} block text-center cursor-pointer`}>
                Create A Run Group
              </span>
            </Link>
            <Link href="/groups">
              <span className={`${buttonBase} ${buttonSuccess} ${buttonLg} block text-center cursor-pointer`}>
                View Run Groups
              </span>
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            <p>Find your perfect running community</p>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Events</h2>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏃</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Available</h3>
              <p className="text-gray-600">Check back later for upcoming run events!</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <Link key={event.id} href={`/groups/${event.groupId}`} className="block">
                    <div
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {event.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Created by: {event.groupName}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>📍 {event.location}</span>
                            <span>🕐 {formatEventTime(event.time)}</span>
                            <span>📏 {event.distance} km</span>
                            <span>🏃 {event.paceGroups.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {events.length > 5 && (
                <div className="text-center mt-6">
                  <Link href="/events">
                    <span className={`${buttonBase} ${buttonPrimary} px-8 py-4 text-lg inline-block cursor-pointer`}>
                      View All Events
                    </span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
