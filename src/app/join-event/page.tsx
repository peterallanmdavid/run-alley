import { redirect } from 'next/navigation';
import { ContainerCard, Button } from '@/components';
import { getEventBySecretCodeServer } from '@/lib/server-utils';
import JoinEventActions from './JoinEventActions';

interface JoinEventPageProps {
  searchParams: Promise<{ secretcode?: string }>;
}

export default async function JoinEventPage({ searchParams }: JoinEventPageProps) {
  const { secretcode } = await searchParams;
  
  if (!secretcode) {
    redirect('/events');
  }

  const event = await getEventBySecretCodeServer(secretcode);
  
  if (!event) {
    return (
      <div className="py-8">
        <div className="max-w-md mx-auto px-4">
          <ContainerCard className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invite Link</h1>
            <p className="text-gray-600 mb-6">This invite link is invalid or has expired.</p>
            <Button variant="primary" onClick={() => window.location.href = '/events'}>
              Browse Events
            </Button>
          </ContainerCard>
        </div>
      </div>
    );
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
      <div className="max-w-2xl mx-auto px-4">
        <ContainerCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🏃</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Event</h1>
            <p className="text-gray-600">You&apos;ve been invited to join this run event!</p>
          </div>

          {/* Event Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.name}</h2>
            
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
                      {event.paceGroups.map((pace: string, index: number) => (
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

          {/* Action Buttons */}
          <JoinEventActions secretCode={secretcode} eventName={event.name} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Organized by {event.groupName}
            </p>
          </div>
        </ContainerCard>
      </div>
    </div>
  );
} 