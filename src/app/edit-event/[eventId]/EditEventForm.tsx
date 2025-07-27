'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateEvent } from '@/lib/api';
import { PaceGroupsSelect, AddParticipantModal, Button } from '@/components';
import { GroupEvent, Member } from '@/lib/data';
import { removeEventParticipantAction } from '@/lib/actions';
import RemoveParticipantModal from './RemoveParticipantModal';

interface EditEventFormProps {
  event: GroupEvent;
  groupId: string;
  members: Member[];
  currentParticipants: { memberId: string }[];
}

export default function EditEventForm({ event, groupId, members, currentParticipants }: EditEventFormProps) {
  const [name, setName] = useState(event.name);
  const [location, setLocation] = useState(event.location);
  const [time, setTime] = useState(event.time);
  const [distance, setDistance] = useState(event.distance);
  const [paceGroups, setPaceGroups] = useState<string[]>(event.paceGroups);
  const [loading, setLoading] = useState(false);
  const [showAddParticipants, setShowAddParticipants] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();

  const handleParticipantsAdded = () => {
    // Refresh the page to get updated participant count
    router.refresh();
  };

  const handleRemoveParticipant = (participantId: string, participantName: string) => {
    setParticipantToRemove({ id: participantId, name: participantName });
    setShowRemoveConfirm(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEvent(groupId, event.id, { name, location, time, distance, paceGroups });
      router.push('/my-events');
    } catch (err) {
      alert('Failed to update event');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Event Name</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Location</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Date & Time</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={time} 
                onChange={e => setTime(e.target.value)} 
                required 
                type="datetime-local" 
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Distance (km)</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={distance} 
                onChange={e => setDistance(e.target.value)} 
                required 
                type="number" 
                min="0.1" 
                max="100" 
                step="0.1" 
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Pace Groups</label>
              <PaceGroupsSelect value={paceGroups} onChange={setPaceGroups} />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => router.push('/my-events')}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200" 
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Event'}
              </button>
            </div>
          </form>
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <label className="block font-medium text-gray-700">Participants</label>
              <Button
                type="button"
                onClick={() => setShowAddParticipants(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
              >
                Add Participants
              </Button>
            </div>
            
            {/* Show current participants list */}
            {currentParticipants.length > 0 ? (
              <div>
                <div className="space-y-2">
                  {event.participants?.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-semibold">
                            {participant.member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {participant.member.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {participant.member.email ||''}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipant(participant.id, participant.member.name)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                          title="Remove participant"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">No participants yet</p>
                <p className="text-xs text-gray-500 mt-1">Click &ldquo;Add Participants&rdquo; to invite members</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddParticipantModal
        isOpen={showAddParticipants}
        onClose={() => setShowAddParticipants(false)}
        eventId={event.id}
        secretKey={event.secretKey || ''}
        groupId={groupId}
        existingMembers={members}
        currentParticipants={currentParticipants}
        onParticipantsAdded={handleParticipantsAdded}
      />
           
      <RemoveParticipantModal
        open={showRemoveConfirm}
        onOpenChange={(open) => setShowRemoveConfirm(open)}
        participant={participantToRemove}
        onConfirm={async (participantId) => {
          const result = await removeEventParticipantAction(event.id, participantId);
          if (result.success) {
            router.refresh();
          } else {
            alert(result.error || 'Failed to remove participant');
          }
        }}
      />
           
    </div>
  );
} 