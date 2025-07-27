'use client';

import { useState } from 'react';
import { Button } from '@/components';
import { AddParticipantModal } from '@/components';
import { Member } from '@/lib/data';

interface AddParticipantButtonProps {
  eventId: string;
  secretKey: string;
  groupId: string;
  existingMembers: Member[];
  currentParticipants?: { memberId: string }[];
}

export default function AddParticipantButton({
  eventId,
  secretKey,
  groupId,
  existingMembers,
  currentParticipants = [],
}: AddParticipantButtonProps) {
  const [showModal, setShowModal] = useState(false);

  // Check if all members are already participants
  const availableMembers = existingMembers.filter(member => 
    !currentParticipants.some(participant => participant.memberId === member.id)
  );
  const allMembersAreParticipants = availableMembers.length === 0;

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="secondary"
        className="text-sm px-3 py-1"
        disabled={allMembersAreParticipants}
      >
        Add Participant
      </Button>

      <AddParticipantModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        eventId={eventId}
        secretKey={secretKey}
        groupId={groupId}
        existingMembers={existingMembers}
        currentParticipants={currentParticipants}
      />
    </>
  );
} 