'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { removeEvent } from '@/lib/api';
import { ConfirmationModal } from '@/components';

interface RemoveEventButtonProps {
  eventId: string;
  groupId: string;
  eventName: string;
}

export default function RemoveEventButton({ eventId, groupId, eventName }: RemoveEventButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeEvent(groupId, eventId);
      router.refresh(); // Refresh the page to show updated list
    } catch (error) {
      alert('Failed to remove event');
    } finally {
      setLoading(false);
      setShowModal(false);
    }
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
        loading={loading}
      />
    </>
  );
} 