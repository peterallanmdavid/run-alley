'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input } from '@/components';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';

function generatePassword(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;
  const [password, setPassword] = useState(generatePassword());
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

  const handleGenerate = () => {
    setPassword(generatePassword());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Call backend to update password for groupId
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setOpen(false);
    router.push('/admin');
  };

  return (
    <Dialog open={open} onOpenChange={open => { setOpen(open); if (!open) handleClose(); }}>
      <DialogContent className="p-0">
        <div className="p-8">
          <DialogHeader>
            <DialogTitle>Reset Group Password</DialogTitle>
          </DialogHeader>
          {success ? (
            <div className="text-center">
              <div className="text-green-600 text-lg font-semibold mb-2">Password updated!</div>
              <div className="mb-4">New password:</div>
              <div className="font-mono text-lg bg-gray-100 rounded p-2 mb-4 inline-block">{password}</div>
              <DialogClose asChild>
                <Button onClick={handleClose}>Back to Admin</Button>
              </DialogClose>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="flex gap-2">
                  <Input
                    id="new-password"
                    name="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="button" variant="secondary" onClick={handleGenerate}>
                    Generate
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className="flex-1">Cancel</Button>
                </DialogClose>
                <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 