import Link from 'next/link';
import { Button, ContainerCard } from '@/components';
import { getCurrentUserServer, getEventsServer } from '@/lib/server-utils';
import { GroupEvent } from '@/lib/data';
import { redirect } from 'next/navigation';
import RemoveEventButton from './RemoveEventButton';

export default async function MyEventsPage() {
  const currentUser = await getCurrentUserServer();
  if (!currentUser) {
    redirect('/login');
  }
  let events: GroupEvent[] = [];
  try {
    events = await getEventsServer(currentUser.group.id);
  } catch (error) {
    console.error('Error fetching events:', error);
  }
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <Link href="/add-event">
          <Button variant="primary">Create Event</Button>
          </Link>
        </div>
        {events.length === 0 ? (
          <ContainerCard className="p-12 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏃</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Events Yet</h2>
              <p className="text-gray-600 mb-6">Create your first event for your run group!</p>
            </div>
            <Link href="/add-event">
              <span className="font-semibold rounded-xl transition duration-200 transform hover:scale-105 shadow-lg bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg w-full block text-center cursor-pointer">
                Create Your First Event
              </span>
            </Link>
          </ContainerCard>
        ) : (
          <ContainerCard>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Events</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {events.map((event) => (
                <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        🏃
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                        <p className="text-sm text-gray-600">
                          📍 {event.location} • 📅 {formatEventTime(event.time)} • 📏 {event.distance} km
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {event.paceGroups.map((pace, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {pace}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/edit-event/${event.id}`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1 rounded-md transition-colors duration-200">
                          Edit
                        </button>
                      </Link>
                      <RemoveEventButton eventId={event.id} groupId={currentUser.group.id} eventName={event.name} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ContainerCard>
        )}
      </div>
    </div>
  );
}

function formatEventTime(dateTimeString: string) {
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateTimeString;
  }
} 