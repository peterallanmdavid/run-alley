import Link from 'next/link';
import { Button, ContainerCard, ActionButton } from '@/components';
import { getCurrentUserServer, getEventsServer, getMembersServer } from '@/lib/server-utils';
import { GroupEvent } from '@/lib/data';
import { redirect } from 'next/navigation';
import AddParticipantButton from './AddParticipantButton';
import RemoveEventButton from './RemoveEventButton';

export default async function MyEventsPage() {
  const currentUser = await getCurrentUserServer();
  if (!currentUser) {
    redirect('/login');
  }
  let events: GroupEvent[] = [];
  try {
    events = await getEventsServer(currentUser.group.id, currentUser);
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  const members = await getMembersServer(currentUser.group.id);

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Events</h1>
          <Link href="/add-event">
            <Button variant="primary" className="w-full sm:w-auto">Create Event</Button>
          </Link>
        </div>
        {events.length === 0 ? (
          <ContainerCard className="p-8 sm:p-12 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏃</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Events Yet</h2>
              <p className="text-gray-600 mb-6">Create your first event for your run group!</p>
            </div>
            <Link href="/add-event">
              <span className="font-semibold rounded-xl transition duration-200 transform hover:scale-105 shadow-lg bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full block text-center cursor-pointer">
                Create Your First Event
              </span>
            </Link>
          </ContainerCard>
        ) : (
          <ContainerCard>
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Events</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {events.map((event) => (
                <div key={event.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Event Info */}
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0 mt-1">
                        🏃
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight mb-2">{event.name}</h3>
                        
                        {/* Event details - stacked on mobile */}
                        <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <span>📍</span>
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>📅</span>
                            <span className="truncate">{formatEventTime(event.time)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>📏</span>
                            <span>{event.distance} km</span>
                          </div>
                        </div>
                        
                        {/* Pace groups */}
                        {event.paceGroups && event.paceGroups.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {event.paceGroups.map((pace, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {pace}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Participants */}
                        {event.participants && event.participants.length > 0 && (
                          <p className="text-xs sm:text-sm text-gray-500">
                            👥 {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 sm:gap-2 sm:flex-shrink-0">
                      <AddParticipantButton
                        eventId={event.id}
                        secretKey={event.secretKey || ''}
                        groupId={currentUser.group.id}
                        existingMembers={members}
                        currentParticipants={event.participants?.map(p => ({ memberId: p.memberId })) || []}
                      />
                      <Link href={`/edit-event/${event.id}`}>
                        <ActionButton variant="primary">
                          Edit
                        </ActionButton>
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
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateTimeString;
  }
} 