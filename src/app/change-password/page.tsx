"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input, Button, PasswordInput } from '@/components';
import { changePassword } from '@/lib/api';

function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [changing, setChanging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChanging(true);
    setError("");
    if (newPassword !== repeatPassword) {
      setError("Passwords do not match");
      setChanging(false);
      return;
    }
    try {
      await changePassword(email, oldPassword, newPassword, repeatPassword);
      router.push("/profile");
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message?: string }).message || "Failed to change password");
      } else {
        setError("Failed to change password");
      }
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Change Password</h1>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center">
            {error}
          </div>
        )}
        <PasswordInput
          id="oldPassword"
          name="oldPassword"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          required
          placeholder="Old Password"
        />
        <PasswordInput
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          placeholder="New Password"
        />
        <PasswordInput
          id="repeatPassword"
          name="repeatPassword"
          value={repeatPassword}
          onChange={e => setRepeatPassword(e.target.value)}
          required
          placeholder="Repeat New Password"
        />
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={changing}
        >
          {changing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Changing...
            </span>
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <ChangePasswordForm />
    </Suspense>
  );
} 