import Link from 'next/link';
import { ContainerCard } from '@/components';
import { getAllEvents } from '@/lib/supabase-data';

export default async function EventsPage() {
  const events = await getAllEvents();

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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Events</h1>
        
        {events.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🏃</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Available</h3>
            <p className="text-gray-600">Check back later for upcoming run events!</p>
          </div>
        ) : (
          <ContainerCard>
            <div className="divide-y divide-gray-200">
              {events.map((event) => (
                <Link 
                  key={event.id} 
                  href={`/events/${event.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      🏃
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-lg font-semibold text-gray-900">{event.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {event.groupName}
                          </span>
                          <span className="text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                            👥 {typeof event.participants === 'number' ? event.participants : event.participants?.length || 0} participant{(typeof event.participants === 'number' ? event.participants : event.participants?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
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
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </ContainerCard>
        )}
      </div>
    </div>
  );
} 