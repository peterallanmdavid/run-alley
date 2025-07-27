'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components';
import { getMembersBySecretCode } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Member {
  id: string;
  name: string;
  age: string;
  gender: string;
  email?: string;
}

interface SelectMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  secretCode: string;
  eventName: string;
  onMemberSelect: (memberId: string) => void;
  onNewMember: () => void;
}

export default function SelectMemberModal({
  isOpen,
  onClose,
  secretCode,
  eventName,
  onMemberSelect,
  onNewMember
}: SelectMemberModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && secretCode) {
      fetchMembers();
    }
  }, [isOpen, secretCode]);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const membersData = await getMembersBySecretCode(secretCode);
      setMembers(membersData);
    } catch (err) {
      setError('Failed to load members');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSelect = (memberId: string) => {
    onMemberSelect(memberId);
    onClose();
  };

  const handleNewMember = () => {
    onNewMember();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Select Your Name
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Choose your name from the list of existing members.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading members...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          ) : (
            <>
              {/* Existing Members */}
              {members.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Select Your Name</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {members.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => handleMemberSelect(member.id)}
                        className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-600">
                          Age: {member.age} • Gender: {member.gender}
                          {member.email && ` • ${member.email}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message when no existing members available */}
              {members.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-2">
                    All existing members are already participating in this event.
                  </p>
                  <p className="text-xs text-gray-500">
                    You can add yourself as a new member from the main page.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 