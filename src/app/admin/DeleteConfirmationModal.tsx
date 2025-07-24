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

interface Group {
  id: string;
  name: string;
  email: string;
  description: string;
  createdAt: string;
  role: 'Admin' | 'GroupOwner';
}

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
  onConfirm: (groupId: string) => Promise<void>;
}

export default function DeleteConfirmationModal({ 
  open, 
  onOpenChange, 
  group, 
  onConfirm 
}: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!group) return;
    
    setLoading(true);
    try {
      await onConfirm(group.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete group:', error);
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
              Delete Group
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to delete &quot;{group?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Warning</h4>
              <p className="text-red-700 text-sm">
                This will permanently delete the group and all associated data including members and events.
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
                onClick={handleDelete}
                variant="secondary"
                className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Group'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 