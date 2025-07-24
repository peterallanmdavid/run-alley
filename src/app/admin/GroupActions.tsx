'use client';

import { useState } from 'react';
import { Button } from '@/components';
import ResetPasswordModal from './ResetPasswordModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';

interface Group {
  id: string;
  name: string;
  email: string;
  description: string;
  createdAt: string;
  role: 'Admin' | 'GroupOwner';
}

interface GroupActionsProps {
  group: Group;
}

export function GroupActions({ group }: GroupActionsProps) {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleDeleteGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete group');
      }
      
      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete group');
    }
  };

  const handleResetPasswordSuccess = (newPassword: string) => {
    setTempPassword(newPassword);
    setShowTempPassword(true);
    setShowResetPassword(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
      alert('Failed to copy password to clipboard');
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={() => setShowResetPassword(true)}
          variant="secondary"
          className="text-sm"
        >
          Reset Password
        </Button>
        <Button
          onClick={() => setShowDeleteConfirm(true)}
          variant="secondary"
          className="text-sm text-red-600 hover:text-red-700"
        >
          Delete
        </Button>
      </div>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        open={showResetPassword}
        onOpenChange={setShowResetPassword}
        group={group}
        onSuccess={handleResetPasswordSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        group={group}
        onConfirm={handleDeleteGroup}
      />

      {/* Temp Password Modal (shadcn Dialog) */}
      <Dialog open={showTempPassword} onOpenChange={setShowTempPassword}>
        <DialogContent className="p-0">
          <div className="p-8">
            <DialogHeader>
              <DialogTitle>Password Reset!</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 mb-4">The new password for this group is:</p>
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-lg text-gray-900 select-all">
                {tempPassword}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCopy}
                className="px-3"
              >
                {copied ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mb-2">Password copied to clipboard!</p>
            )}
            <p className="text-sm text-gray-500 mb-4">
              Please share this password with the group owner. They will be prompted to change it on first login.
            </p>
            <DialogClose asChild>
              <Button
                variant="primary"
                className="w-full"
              >
                OK
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 