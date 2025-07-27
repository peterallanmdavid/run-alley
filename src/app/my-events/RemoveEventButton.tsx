'use client';

import { useState, useTransition } from 'react';
import { removeEventAction } from '@/lib/actions';
import { ConfirmationModal } from '@/components';

interface RemoveEventButtonProps {
  eventId: string;
  groupId: string;
  eventName: string;
}

export default function RemoveEventButton({ eventId, groupId, eventName }: RemoveEventButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const handleRemove = async () => {
    startTransition(async () => {
      const result = await removeEventAction(groupId, eventId);
      
      if (result.success) {
        setShowModal(false);
      } else {
        alert(result.error || 'Failed to remove event');
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1 rounded-md transition-colors duration-200"
      >
        Remove
      </button>
      
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleRemove}
        title="Remove Event"
        description={`Are you sure you want to remove "${eventName}"? This action cannot be undone.`}
        confirmText="Remove Event"
        cancelText="Cancel"
        variant="destructive"
        loading={isPending}
      />
    </>
  );
} 