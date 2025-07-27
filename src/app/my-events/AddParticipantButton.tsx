'use client';

import { useState } from 'react';
import { ActionButton } from '@/components';
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


  return (
    <>
      <ActionButton
        onClick={() =>{
          console.log('Adding participant');
          setShowModal(true)
        }}
        variant="secondary"
      >
        Add Participant
      </ActionButton>

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