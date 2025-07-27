'use client';

import { useState } from 'react';
import { Button } from '@/components';
import JoinEventForm from './JoinEventForm';
import SelectMemberModal from './SelectMemberModal';
import { joinEvent, joinEventWithMember } from '@/lib/api';

interface JoinEventActionsProps {
  secretCode: string;
  eventName: string;
}

export default function JoinEventActions({ secretCode, eventName }: JoinEventActionsProps) {
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMemberSelect = async (memberId: string) => {
    setLoading(true);
    setError(null);
    try {
      await joinEventWithMember(secretCode, memberId);
      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join event';
      if (errorMessage.includes('already a participant')) {
        setError('You are already participating in this event!');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewMember = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: { name: string; age: string; gender: string; email?: string }) => {
    setLoading(true);
    setError(null);
    try {
      await joinEvent(secretCode, formData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join event');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/events';
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Joined!</h2>
        <p className="text-gray-600 mb-6">You have been added to the event participants list.</p>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/events'}
        >
          Browse Other Events
        </Button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Join Event</h3>
          <p className="text-gray-600">Please provide your details to join this event.</p>
        </div>
        <JoinEventForm
          secretCode={secretCode}
          eventName={eventName}
          onSubmit={handleFormSubmit}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            {loading ? 'Joining...' : 'Join as Existing Member'}
          </Button>
          
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleNewMember}
            disabled={loading}
          >
            Join as New Member
          </Button>
          
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>

      <SelectMemberModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        secretCode={secretCode}
        eventName={eventName}
        onMemberSelect={handleMemberSelect}
        onNewMember={handleNewMember}
      />
    </>
  );
} 