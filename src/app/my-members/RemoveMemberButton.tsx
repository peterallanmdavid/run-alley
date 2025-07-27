'use client';

import { useState, useTransition } from 'react';
import { removeMemberAction } from '@/lib/actions';
import { ConfirmationModal, ActionButton } from '@/components';

interface RemoveMemberButtonProps {
  memberId: string;
  groupId: string;
  memberName: string;
}

export default function RemoveMemberButton({ memberId, groupId, memberName }: RemoveMemberButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const handleRemove = async () => {
    startTransition(async () => {
      const result = await removeMemberAction(groupId, memberId);
      
      if (result.success) {
        setShowModal(false);
      } else {
        alert(result.error || 'Failed to remove member');
      }
    });
  };

  return (
    <>
      <ActionButton
        onClick={() => setShowModal(true)}
        variant="danger"
      >
        Remove
      </ActionButton>
      
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleRemove}
        title="Remove Member"
        description={`Are you sure you want to remove "${memberName}"? This action cannot be undone.`}
        confirmText="Remove Member"
        cancelText="Cancel"
        variant="destructive"
        loading={isPending}
      />
    </>
  );
} 