"use client";

import { useState } from 'react';
import Link from 'next/link';

import { Input, TextArea, Button,  ContainerCard } from '@/components';
import { updateGroup,ApiError } from '@/lib/api';
import { RunGroup } from '@/lib/data';



interface ManageGroupClientProps {
  group: RunGroup;
  currentUser: { group: { id: string; name: string; email: string; role: 'Admin' | 'GroupOwner' } };
  totalMembers: number;
  totalEvents: number;
}

export default function ManageGroupClient({ group, currentUser }: ManageGroupClientProps) {
  const [groupData, setGroupData] = useState({
    name: group.name,
    description: group.description,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  // Check if there are unsaved changes
  const hasChanges = groupData.name !== group.name || groupData.description !== group.description;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGroupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateGroup = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!hasChanges) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateGroup(currentUser.group.id, groupData);
      setSuccess('Group updated successfully!');
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to update group');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="py-4">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Group Details Section */}
        <ContainerCard className="p-4 sm:p-6">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Run Group Details</h1>
          </div>
          <div className="mb-8">
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleUpdateGroup} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={groupData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter group name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <TextArea
                  id="description"
                  name="description"
                  value={groupData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe your run group"
                />
              </div>

              <div className="flex gap-4 pt-6 justify-center">
                <Link href="/profile" className="flex-1">
                  <Button variant="secondary" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading || !hasChanges}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </ContainerCard>

      </div>
    </div>
  );
} 