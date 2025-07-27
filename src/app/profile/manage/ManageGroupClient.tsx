"use client";

import { useState } from 'react';
import Link from 'next/link';

import { Input, TextArea, Button, PaceGroupsSelect, ContainerCard, ConfirmationModal } from '@/components';
import { updateGroup, addMember, removeMember, addEvent, removeEvent, ApiError } from '@/lib/api';
import { RunGroup } from '@/lib/data';
import EventsCard from '@/components/EventsCard';


interface ManageGroupClientProps {
  group: RunGroup;
  currentUser: { group: { id: string; name: string; email: string; role: 'Admin' | 'GroupOwner' } };
  totalMembers: number;
  totalEvents: number;
}

export default function ManageGroupClient({ group, currentUser, totalMembers, totalEvents }: ManageGroupClientProps) {
  const [groupData, setGroupData] = useState({
    name: group.name,
    description: group.description,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Confirmation modal states
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [showRemoveEventModal, setShowRemoveEventModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null);
  const [eventToRemove, setEventToRemove] = useState<{ id: string; name: string } | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  // Check if there are unsaved changes
  const hasChanges = groupData.name !== group.name || groupData.description !== group.description;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGroupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateGroup = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!hasChanges) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateGroup(currentUser.group.id, groupData);
      setSuccess('Group updated successfully!');
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to update group');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatEventTime = (dateTimeString: string) => {
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
  };

  return (
    <div className="py-4">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Group Details Section */}
        <ContainerCard className="p-4 sm:p-6">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Run Group Details</h1>
          </div>
          <div className="mb-8">
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleUpdateGroup} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={groupData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter group name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <TextArea
                  id="description"
                  name="description"
                  value={groupData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe your run group"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading || !hasChanges}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </ContainerCard>

        {/* Members List */}
        <ContainerCard className="mt-4 p-4">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Members</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Link href="/my-members" className="text-blue-600 hover:underline text-sm font-medium">
                <Button variant="secondary">
                  Manage Members ({totalMembers})
                </Button>
              </Link>
              <Link href="/add-member">
                <Button variant="success" className="w-full sm:w-auto">
                  Add Member
                </Button>
              </Link>
            </div>
          </div>
          
          {!group.members || group.members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No members yet. Add the first member!</p>
            </div>
          ) : (
            <ContainerCard>
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Recent Members</h4>
              </div>
              <div className="divide-y divide-gray-200">
                {group.members.map((member) => (
                  <div key={member.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0 mt-1">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight mb-1">{member.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Age: {member.age} • Gender: {member.gender}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ContainerCard>
          )}
        </div>
        </ContainerCard>

        {/* Events List */}
        <ContainerCard className="mt-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Link href="/my-events" className="text-blue-600 hover:underline text-sm font-medium">
                <Button variant="secondary">
                  Manage Events ({totalEvents})
                </Button>
              </Link>
              <Link href="/add-event">
                <Button variant="success" className="w-full sm:w-auto">
                  Add Event
                </Button>
              </Link>
            </div>
          </div>
          
          {!group.events || group.events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No events yet. Add the first event!</p>
            </div>
          ) : (
            <ContainerCard>
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Recent Events</h4>
              </div>
              <div className="divide-y divide-gray-200">
                {group.events.map((event) => (
                  <div key={event.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0 mt-1">
                        🏃
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight mb-2">{event.name}</h4>
                        
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
                          <div className="flex flex-wrap gap-1">
                            {event.paceGroups.map((pace, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {pace}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ContainerCard>
          )}
        </ContainerCard>
      </div>
    </div>
  );
} 