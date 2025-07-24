'use client';

import { useState } from 'react';
import { Button } from '@/components';
import { resetPassword } from '@/lib/api';
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
}

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
  onSuccess?: (password: string) => void;
}

export default function ResetPasswordModal({ open, onOpenChange, group, onSuccess }: ResetPasswordModalProps) {
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
      alert('Failed to copy password to clipboard');
    }
  };

  const handleReset = async () => {
    if (!group) return;
    setLoading(true);
    setError('');
    try {
      const result = await resetPassword(group.id);
      setGeneratedPassword(result.newPassword);
      setStep('success');
      setLoading(false);
      if (onSuccess) onSuccess(result.newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('confirm');
    setGeneratedPassword('');
    setCopied(false);
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0">
        <div className="p-8">
          <DialogHeader>
            <DialogTitle>Reset Group Password</DialogTitle>
          </DialogHeader>
          {step === 'confirm' && (
            <div>
              <p className="mb-6 text-gray-700">Are you sure you want to reset the password for <span className="font-semibold">{group?.name}</span>? This will generate a new password and require the group owner to change it on next login.</p>
              {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
              <div className="flex gap-2 pt-2">
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className="flex-1">Cancel</Button>
                </DialogClose>
                <Button
                  type="button"
                  variant="primary"
                  className="flex-1"
                  onClick={handleReset}
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </div>
            </div>
          )}
          {step === 'success' && (
            <div className="text-center">
              <div className="text-green-600 text-lg font-semibold mb-2">Password reset!</div>
              <div className="mb-4">The new password is:</div>
              <div className="flex justify-center items-center gap-2 mb-4">
                <div className="font-mono text-lg bg-gray-100 rounded p-2 inline-block select-all">{generatedPassword}</div>
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
              <DialogClose asChild>
                <Button onClick={handleClose}>Back to Admin</Button>
              </DialogClose>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 