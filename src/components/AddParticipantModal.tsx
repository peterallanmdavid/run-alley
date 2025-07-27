'use client';

import { useState, useTransition } from 'react';
import { Member } from '@/lib/data';
import { Button, Input } from '@/components';
import { addMultipleParticipantsAction, addNewMemberAndParticipantAction } from '@/lib/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  secretKey: string;
  groupId: string;
  existingMembers: Member[];
  currentParticipants?: { memberId: string }[];
  onParticipantsAdded?: () => void;
}

export default function AddParticipantModal({
  isOpen,
  onClose,
  eventId,
  secretKey,
  groupId,
  existingMembers,
  currentParticipants = [],
  onParticipantsAdded,
}: AddParticipantModalProps) {
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [showNewMemberForm, setShowNewMemberForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter out members who are already participants
  const availableMembers = existingMembers.filter(member => 
    !currentParticipants.some(participant => participant.memberId === member.id)
  );

  const handleAddMultipleParticipants = async () => {
    if (selectedMemberIds.length === 0) return;
    
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      const result = await addMultipleParticipantsAction(eventId, selectedMemberIds, secretKey);
      
      if (result.success) {
        setSuccess(`Successfully added ${result.summary.added} participant${result.summary.added !== 1 ? 's' : ''}!`);
        setSelectedMemberIds([]);
        
        // Call the callback to refresh parent component
        onParticipantsAdded?.();
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onClose();
          setSuccess(null);
        }, 1500);
      } else {
        setError(result.errors?.[0]?.error || 'Failed to add participants');
      }
    });
  };

  const handleAddNewMember = async () => {
    if (!newMember.name || !newMember.age || !newMember.gender) return;
    
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      const result = await addNewMemberAndParticipantAction(eventId, secretKey, groupId, newMember);
      
      if (result.success) {
        setSuccess('New member created and added as participant!');
        setNewMember({ name: '', age: '', gender: '', email: '' });
        setShowNewMemberForm(false);
        
        // Call the callback to refresh parent component
        onParticipantsAdded?.();
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onClose();
          setSuccess(null);
        }, 1500);
      } else {
        setError(result.error || 'Failed to add new member as participant');
      }
    });
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    setSelectedMemberIds([]);
    setNewMember({ name: '', age: '', gender: '', email: '' });
    setShowNewMemberForm(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Participant</DialogTitle>
          <DialogDescription>
            Add a member as a participant to this event.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        <div className="space-y-4">
          {!showNewMemberForm ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Existing Members
                </label>
                {availableMembers.length === 0 ? (
                  <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg border">
                    All members are already participants in this event.
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-700">
                        {selectedMemberIds.length} of {availableMembers.length} selected
                      </span>
                      <div className="flex gap-2 text-xs">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => setSelectedMemberIds(availableMembers.map(m => m.id))}
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800 font-medium"
                          onClick={() => setSelectedMemberIds([])}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {availableMembers.map((member) => (
                        <label
                          key={member.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMemberIds.includes(member.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMemberIds([...selectedMemberIds, member.id]);
                              } else {
                                setSelectedMemberIds(selectedMemberIds.filter(id => id !== member.id));
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-xs text-gray-500">
                              {member.age} years old • {member.gender}
                              {member.email && ` • ${member.email}`}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowNewMemberForm(true)}
                className="w-full"
              >
                Create New Member
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Name *
                </label>
                <Input
                  id="memberName"
                  name="memberName"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <Input
                    id="memberAge"
                    name="memberAge"
                    type="number"
                    value={newMember.age}
                    onChange={(e) => setNewMember(prev => ({ ...prev, age: e.target.value }))}
                    required
                    min={1}
                    max={120}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newMember.gender}
                    onChange={(e) => setNewMember(prev => ({ ...prev, gender: e.target.value }))}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address (Optional)
                </label>
                <Input
                  id="memberEmail"
                  name="memberEmail"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="member@example.com"
                />
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowNewMemberForm(false)}
                className="w-full"
              >
                Back to Existing Members
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={showNewMemberForm ? handleAddNewMember : handleAddMultipleParticipants}
            disabled={isPending || (showNewMemberForm && (!newMember.name || !newMember.age || !newMember.gender)) || (selectedMemberIds.length === 0 && !showNewMemberForm)}
          >
            {isPending ? 'Adding...' : showNewMemberForm ? 'Add New Member' : `Add ${selectedMemberIds.length} Participant${selectedMemberIds.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 