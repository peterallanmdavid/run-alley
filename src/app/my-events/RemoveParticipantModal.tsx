'use client';

import { useState } from 'react';
import { Button } from '@/components';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Participant {
  id: string;
  name: string;
}

interface RemoveParticipantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: Participant | null;
  onConfirm: (participantId: string) => Promise<void>;
}

export default function RemoveParticipantModal({ 
  open, 
  onOpenChange, 
  participant, 
  onConfirm 
}: RemoveParticipantModalProps) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    if (!participant) return;
    
    setLoading(true);
    try {
      await onConfirm(participant.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to remove participant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <div className="p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Remove Participant
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to remove &quot;{participant?.name}&quot; from this event?
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Warning</h4>
              <p className="text-red-700 text-sm">
                This will remove the participant from the event. They will no longer be able to see event details.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                variant="secondary"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleRemove}
                variant="secondary"
                className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                disabled={loading}
              >
                {loading ? 'Removing...' : 'Remove Participant'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 