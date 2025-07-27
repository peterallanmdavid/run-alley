import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/supabase-data';
import { ContainerCard } from '@/components';

interface EventDetailsPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { eventId } = await params;
  
  const event = await getEventById(eventId);
  
  if (!event) {
    notFound();
  }

  const formatEventTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
          <p className="text-gray-600">Organized by {event.groupName}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Event Details */}
          <ContainerCard>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm">📍</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">📅</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Date & Time</p>
                    <p className="text-gray-600">{formatEventTime(event.time)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-sm">📏</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Distance</p>
                    <p className="text-gray-600">{event.distance} km</p>
                  </div>
                </div>

                {event.paceGroups && event.paceGroups.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 text-sm">🏃</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pace Groups</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {event.paceGroups.map((pace, index) => (
                          <span key={index} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                            {pace}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ContainerCard>

          {/* Participants */}
          <ContainerCard>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Participants ({typeof event.participants === 'number' ? event.participants : event.participants?.length || 0})
              </h2>
              
              {Array.isArray(event.participants) && event.participants.length > 0 ? (
                <div className="space-y-3">
                  {event.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {participant.member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{participant.member.name}</p>
                        <p className="text-sm text-gray-600">
                          {participant.member.age} years old • {participant.member.gender}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl">👥</span>
                  </div>
                  <p className="text-gray-600">
                    {typeof event.participants === 'number' && event.participants > 0 
                      ? `${event.participants} participant${event.participants !== 1 ? 's' : ''} joined`
                      : 'No participants yet'
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {typeof event.participants === 'number' && event.participants > 0 
                      ? 'Sign in to see participant details'
                      : 'Be the first to join!'
                    }
                  </p>
                </div>
              )}
            </div>
          </ContainerCard>
        </div>
      </div>
    </div>
  );
} 