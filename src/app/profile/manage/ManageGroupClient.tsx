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

  const handleCancelEdit = () => {
    setGroupData({
      name: group.name,
      description: group.description || ''
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    setRemoveLoading(true);
    try {
      await removeMember(currentUser.group.id, memberId);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('Failed to remove member');
      }
    } finally {
      setRemoveLoading(false);
      setShowRemoveMemberModal(false);
      setMemberToRemove(null);
    }
  };

  const handleRemoveEvent = async (eventId: string) => {
    setRemoveLoading(true);
    try {
      await removeEvent(currentUser.group.id, eventId);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('Failed to remove event');
      }
    } finally {
      setRemoveLoading(false);
      setShowRemoveEventModal(false);
      setEventToRemove(null);
    }
  };

  const openRemoveMemberModal = (member: { id: string; name: string }) => {
    setMemberToRemove(member);
    setShowRemoveMemberModal(true);
  };

  const openRemoveEventModal = (event: { id: string; name: string }) => {
    setEventToRemove(event);
    setShowRemoveEventModal(true);
  };

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
      return dateTimeString;
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Run Group Details</h1>
            </div>
          </div>

          {/* Group Details Section */}
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

          {/* Members List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Members</h3>
              <div className="flex items-center space-x-2">
                <Link href="/my-members" className="text-blue-600 hover:underline text-sm font-medium">
                  View All ({totalMembers})
                </Link>
                <Link href="/add-member">
                  <Button variant="success">
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
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900">Recent Members</h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {group.members.slice(0, 5).map((member) => (
                    <div key={member.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                            <p className="text-sm text-gray-600">Age: {member.age} • Gender: {member.gender}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => openRemoveMemberModal(member)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </ContainerCard>
            )}
          </div>

          {/* Events List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
              <div className="flex items-center space-x-2">
                <Link href="/my-events" className="text-blue-600 hover:underline text-sm font-medium">
                  View All ({totalEvents})
                </Link>
                <Link href="/add-event">
                  <Button variant="primary">
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
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900">Recent Events</h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {group.events.slice(0, 5).map((event) => (
                    <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            🏃
                          </div>
                          <div>
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
                        <button
                          onClick={() => openRemoveEventModal(event)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </ContainerCard>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showRemoveMemberModal}
        onClose={() => setShowRemoveMemberModal(false)}
        onConfirm={() => memberToRemove && handleRemoveMember(memberToRemove.id)}
        title="Remove Member"
        description={`Are you sure you want to remove "${memberToRemove?.name}"? This action cannot be undone.`}
        confirmText="Remove Member"
        cancelText="Cancel"
        variant="destructive"
        loading={removeLoading}
      />
      
      <ConfirmationModal
        isOpen={showRemoveEventModal}
        onClose={() => setShowRemoveEventModal(false)}
        onConfirm={() => eventToRemove && handleRemoveEvent(eventToRemove.id)}
        title="Remove Event"
        description={`Are you sure you want to remove "${eventToRemove?.name}"? This action cannot be undone.`}
        confirmText="Remove Event"
        cancelText="Cancel"
        variant="destructive"
        loading={removeLoading}
      />
    </div>
  );
} 