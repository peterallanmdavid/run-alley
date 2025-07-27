'use client';

import { useState } from 'react';
import { ActionButton, QRCodeModal } from '@/components';

interface InviteButtonProps {
  eventName: string;
  secretCode: string;
}

export default function InviteButton({ eventName, secretCode }: InviteButtonProps) {
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <>
      <ActionButton
        onClick={() => setShowQRModal(true)}
        variant="secondary"
      >
        <span className="flex items-center gap-2">
          Share
        </span>
      </ActionButton>

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        eventName={eventName}
        secretCode={secretCode}
      />
    </>
  );
} 