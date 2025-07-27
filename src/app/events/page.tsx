'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ContainerCard } from '@/components';
import { getAllEvents, ApiError } from '@/lib/api';
import { GroupEvent } from '@/lib/data';
import EventsCard from '@/components/EventsCard';

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
            <ContainerCard>
              <div className="divide-y divide-gray-200">
                {events.map((event) => (
                  <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        🏃
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-lg font-semibold text-gray-900">{event.name}</h4>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {event.groupName}
                          </span>
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