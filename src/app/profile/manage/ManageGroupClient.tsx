"use client";

import { useState } from 'react';

import { Input, TextArea, Button, PaceGroupsSelect } from '@/components';
import { updateGroup, addMember, removeMember, addEvent, removeEvent, ApiError } from '@/lib/api';
import { RunGroup } from '@/lib/data';
import EventsCard from '@/components/EventsCard';


interface ManageGroupClientProps {
  group: RunGroup;
  currentUser: { id: string; name: string; email: string; role: string };
}

export default function ManageGroupClient({ group: initialGroup, currentUser }: ManageGroupClientProps) {
  
  const [group, setGroup] = useState<RunGroup>(initialGroup);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: initialGroup.name,
    description: initialGroup.description || ''
  });
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    age: '',
    gender: ''
  });
  const [newEvent, setNewEvent] = useState({
    name: '',
    location: '',
    time: '',
    distance: '',
    paceGroups: [] as string[],
    date: undefined as Date | undefined,
    hour: 12,
    minute: 0,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const updatedGroup = await updateGroup(currentUser.id, formData);
      setGroup(updatedGroup);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Failed to update group');
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: group.name,
      description: group.description || ''
    });
    setIsEditing(false);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.age || !newMember.gender) return;
    setMemberLoading(true);
    try {
      const member = await addMember(currentUser.id, newMember);
      setGroup(prev => ({
        ...prev,
        members: [...(prev.members || []), member]
      }));
      setNewMember({ name: '', age: '', gender: '' });
      setShowAddMember(false);
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Failed to add member');
      }
    } finally {
      setMemberLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(currentUser.id, memberId);
      setGroup(prev => ({
        ...prev,
        members: prev.members.filter(m => m.id !== memberId)
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Failed to remove member');
      }
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.location || !newEvent.time || !newEvent.distance || newEvent.paceGroups.length === 0) return;
    setEventLoading(true);
    try {
      const event = await addEvent(currentUser.id, newEvent);
      setGroup(prev => ({
        ...prev,
        events: [...(prev.events || []), event]
      }));
      setNewEvent({ name: '', location: '', time: '', distance: '', paceGroups: [], date: undefined, hour: 12, minute: 0 });
      setShowAddEvent(false);
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Failed to add event');
      }
    } finally {
      setEventLoading(false);
    }
  };

  const handleRemoveEvent = async (eventId: string) => {
    try {
      await removeEvent(currentUser.id, eventId);
      setGroup(prev => ({
        ...prev,
        events: prev.events.filter(e => e.id !== eventId)
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Failed to remove event');
      }
    }
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
            <div className="flex gap-3">
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="primary"
                >
                  Edit Group
                </Button>
              )}
            </div>
          </div>

          {/* Group Details Section */}
          <div className="mb-8">
            {isEditing ? (
              <form onSubmit={handleSaveChanges} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
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
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe your run group"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    onClick={handleCancelEdit}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={editLoading}
                  >
                    {editLoading ? (
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
            ) : (
              <div className="space-y-6">
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
            )}
          </div>

          {/* Members List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Members ({group.members?.length || 0})</h3>
              <Button
                onClick={() => setShowAddMember(true)}
                variant="success"
              >
                Add Member
              </Button>
            </div>
            {showAddMember && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Member</h3>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <Input
                        id="memberName"
                        name="name"
                        value={newMember.name}
                        onChange={handleMemberInputChange}
                        required
                        placeholder="Enter member name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="memberAge" className="block text-sm font-medium text-gray-700 mb-2">
                        Age *
                      </label>
                      <Input
                        id="memberAge"
                        name="age"
                        type="number"
                        value={newMember.age}
                        onChange={handleMemberInputChange}
                        required
                        min={1}
                        max={120}
                        placeholder="Enter age"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="memberGender" className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        id="memberGender"
                        name="gender"
                        value={newMember.gender}
                        onChange={handleMemberInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setShowAddMember(false)}
                      variant="secondary"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="success"
                      className="flex-1"
                      disabled={memberLoading}
                    >
                      {memberLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Adding...
                        </span>
                      ) : (
                        'Save Member'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {!group.members || group.members.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No members yet. Add the first member!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.members.map((member) => (
                  <div key={member.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{member.name}</h4>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Age: {member.age}</p>
                      <p>Gender: {member.gender}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Events List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Group Events ({group.events?.length || 0})</h3>
              <Button
                onClick={() => setShowAddEvent(true)}
                variant="primary"
              >
                Add Event
              </Button>
            </div>
            {showAddEvent && (
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Event</h3>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
                        Event Name *
                      </label>
                      <Input
                        id="eventName"
                        name="name"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                        required
                        placeholder="Enter event name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <Input
                        id="eventLocation"
                        name="location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                        required
                        placeholder="Enter location"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Date & Time *
                      </label>
                      <Input
                        id="eventTime"
                        name="time"
                        type="datetime-local"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="eventDistance" className="block text-sm font-medium text-gray-700 mb-2">
                        Distance (kilometers) *
                      </label>
                      <Input
                        id="eventDistance"
                        name="distance"
                        type="number"
                        value={newEvent.distance}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, distance: e.target.value }))}
                        required
                        min={0.1}
                        max={100}
                        step={0.1}
                        placeholder="e.g., 5, 10.5, 21"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pace Groups *
                    </label>
                    <PaceGroupsSelect
                      value={newEvent.paceGroups}
                      onChange={(value) => setNewEvent(prev => ({ ...prev, paceGroups: value }))}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setShowAddEvent(false)}
                      variant="secondary"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1"
                      disabled={eventLoading}
                    >
                      {eventLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Adding...
                        </span>
                      ) : (
                        'Save Event'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {!group.events || group.events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No events yet. Add the first event!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.events.map((event) => (
                  <EventsCard
                    key={event.id}
                    event={event}
                    handleRemoveEvent={handleRemoveEvent}
                    formatEventTime={formatEventTime}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 