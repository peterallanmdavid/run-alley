'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { removeMember } from '@/lib/api';
import { ConfirmationModal } from '@/components';

interface RemoveMemberButtonProps {
  memberId: string;
  groupId: string;
  memberName: string;
}

export default function RemoveMemberButton({ memberId, groupId, memberName }: RemoveMemberButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeMember(groupId, memberId);
      router.refresh(); // Refresh the page to show updated list
    } catch (error) {
      alert('Failed to remove member');
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
        title="Remove Member"
        description={`Are you sure you want to remove "${memberName}"? This action cannot be undone.`}
        confirmText="Remove Member"
        cancelText="Cancel"
        variant="destructive"
        loading={loading}
      />
    </>
  );
} 