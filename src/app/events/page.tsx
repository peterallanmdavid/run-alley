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
                  className="block px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0 mt-1">
                      🏃
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Header with title and badges */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                          {event.name}
                        </h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                            {event.groupName}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded-full whitespace-nowrap">
                            👥 {typeof event.participants === 'number' ? event.participants : event.participants?.length || 0} participant{(typeof event.participants === 'number' ? event.participants : event.participants?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      
                      {/* Event details - stacked on mobile, horizontal on desktop */}
                      <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <span>📍</span>
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span>{formatEventTime(event.time)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📏</span>
                          <span>{event.distance} km</span>
                        </div>
                      </div>
                      
                      {/* Pace groups */}
                      {event.paceGroups && event.paceGroups.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {event.paceGroups.map((pace, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {pace}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Arrow icon */}
                    <div className="text-gray-400 flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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