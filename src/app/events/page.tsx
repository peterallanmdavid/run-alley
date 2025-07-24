'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components';
import { getAllEvents, ApiError } from '@/lib/api';
import { GroupEvent } from '@/lib/data';

interface EventWithGroup extends GroupEvent {
  groupName: string;
  groupId: string;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventWithGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = await getAllEvents();
        setEvents(allEvents);
      } catch (error) {
        if (error instanceof ApiError) {
          console.error('Error loading events:', error.message);
        } else {
          console.error('Failed to load events:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

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
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">All Events</h1>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏃</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Available</h3>
              <p className="text-gray-600">Check back later for upcoming run events!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/groups/${event.groupId}`)}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 