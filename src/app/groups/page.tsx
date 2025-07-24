'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components';
import { getGroups, ApiError } from '@/lib/api';
import { RunGroup } from '@/lib/data';

export default function JoinGroup() {
  const router = useRouter();
  const [groups, setGroups] = useState<RunGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groups = await getGroups();
        setGroups(groups);
      } catch (error) {
        if (error instanceof ApiError) {
          console.error('Error loading groups:', error.message);
        } else {
          console.error('Failed to load groups');
        }
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  const handleBack = () => {
    router.push('/');
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading run groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">View Run Groups</h1>
          </div>
          <Button
            onClick={() => router.push('/groups/create')}
            variant="primary"
          >
            Create New Group
          </Button>
        </div>

        {groups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏃</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Run Groups Yet</h2>
              <p className="text-gray-600 mb-6">Be the first to create a run group in your area!</p>
            </div>
            <Button
              onClick={() => router.push('/groups/create')}
              variant="primary"
              size="lg"
            >
              Create Your First Group
            </Button>
          </div>
        ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div 
                  key={group.id} 
                  className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow cursor-pointer"
                  onClick={() => router.push(`/groups/${group.id}`)}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                    {group.description && (
                      <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {group.description && (
                      <div className="flex items-start text-sm">
                        <span className="text-gray-500 w-20">📝 Description:</span>
                        <span className="text-gray-900 flex-1">{group.description}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Created {formatDate(group.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e?.stopPropagation();
                          router.push(`/groups/${group.id}`);
                        }}
                        variant="primary"
                        size="sm"
                      >
                        View
                      </Button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
        )}
      </div>
    </div>
  );
} 