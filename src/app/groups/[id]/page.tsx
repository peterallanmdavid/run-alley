'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getGroup, ApiError } from '@/lib/api';
import { RunGroup } from '@/lib/data';
import EventsCard from '@/components/EventsCard';
import { ContainerCard } from '@/components';

export default function ViewGroup() {
  const params = useParams();
  const groupId = params.id as string;
  
  const [group, setGroup] = useState<RunGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroup = async () => {
      try {
        const foundGroup = await getGroup(groupId);
        setGroup(foundGroup);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          // Handle 404 - group not found
          console.error('Group not found');
        } else {
          console.error('Error loading group:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [groupId]);

  const formatEventTime = (dateTimeString: string) => {
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
      return dateTimeString; // Fallback to original string if parsing fails
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Group Not Found</h1>
            <p className="text-gray-600">The group you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <ContainerCard className='p-8'>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
            <p className="text-gray-600">Run Group Details</p>
          </div>

          {/* Group Details Section */}
          <div className="mb-8">
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {group.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 min-h-[80px]">
                  {group.description || 'No description provided'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {new Date(group.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Members ({group.members?.length || 0})</h3>
            {group.members && group.members.length > 0 ? (
              <ContainerCard>
                <div className="divide-y divide-gray-200">
                  {group.members.map((member) => (
                    <div key={member.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">Age: {member.age} • Gender: {member.gender}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ContainerCard>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Members Yet</h3>
                <p className="text-gray-600">This group doesn&apos;t have any members yet.</p>
              </div>
            )}
          </div>

          {/* Events List */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Events ({group.events?.length || 0})</h3>
            {group.events && group.events.length > 0 ? (
              <ContainerCard>
                <div className="divide-y divide-gray-200">
                  {group.events.map((event) => (
                    <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          🏃
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{event.name}</h4>
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🏃</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Yet</h3>
                <p className="text-gray-600">This group doesn&apos;t have any events scheduled yet.</p>
              </div>
            )}
          </div>
        </ContainerCard>
      </div>
    </div>
  );
} 