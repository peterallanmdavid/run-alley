'use client';

import { useState } from 'react';
import { removeEventParticipantAction } from '@/lib/actions';
import RemoveParticipantModal from './RemoveParticipantModal';

interface RemoveParticipantButtonProps {
  eventId: string;
  participantId: string;
  participantName: string;
}

export default function RemoveParticipantButton({ 
  eventId, 
  participantId, 
  participantName 
}: RemoveParticipantButtonProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = () => {
    setShowConfirm(true);
  };

  const confirmRemove = async (participantId: string) => {
    setIsRemoving(true);
    try {
      const result = await removeEventParticipantAction(eventId, participantId);
      
    if (!result.success) {
        alert(result.error || 'Failed to remove participant');
      }
    } catch (error) {
      console.error('Failed to remove participant:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleRemove}
        className="text-red-500 hover:text-red-700 text-xs font-medium"
        disabled={isRemoving}
        title={`Remove ${participantName}`}
      >
        {isRemoving ? 'Removing...' : 'Remove'}
      </button>

      <RemoveParticipantModal
        open={showConfirm}
        onOpenChange={(open) => setShowConfirm(open)}
        participant={showConfirm ? { id: participantId, name: participantName } : null}
        onConfirm={confirmRemove}
      />
    </>
  );
} 