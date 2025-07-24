'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logout, getGroup, getCurrentUser } from '@/lib/api';
import { RunGroup } from '@/lib/data';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  description: string;
  role: 'Admin' | 'GroupOwner';
}

export default function ProfilePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [group, setGroup] = useState<RunGroup | null>(null);
  
  const [loadingGroup, setLoadingGroup] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const result = await getCurrentUser();
        if (!result || !result.group) {
          router.replace('/login');
          return;
        }
        if (result.group.role !== 'GroupOwner') {
          router.replace('/admin');
          return;
        }
        setCurrentUser(result.group);
        setIsLoggedIn(true);
      } catch {
        router.replace('/login');
      }
    };
    checkRole();
  }, [router]);


  // Load group data when user is authenticated
  useEffect(() => {
    const loadGroup = async () => {
      if (!currentUser) return;
      
      setLoadingGroup(true);
      try {
        const groupData = await getGroup(currentUser.id);
        setGroup(groupData);
      } catch (error) {
        console.error('Error loading group:', error);
      } finally {
        setLoadingGroup(false);
      }
    };

    if (currentUser) {
      loadGroup();
    }
  }, [currentUser]);


  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
      router.replace('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Still clear local state even if API call fails
      setIsLoggedIn(false);
      setCurrentUser(null);
      router.replace('/login');
    }
  };

  const formatEventTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateTimeString;
    }
  };




  const memberCount = group?.members?.length || 0;
  const eventCount = group?.events?.length || 0;
  const recentMembers = group?.members?.slice(-3).reverse() || [];
  const recentEvents = group?.events?.slice(-3).reverse() || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentUser?.name || ''}</h1>
            <p className="text-gray-600">Group Owner Dashboard</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/profile/manage`}>
              <Button variant="primary">Manage Group</Button>
            </Link>
            <Button onClick={handleLogout} variant="secondary">Logout</Button>
          </div>
        </div>

        {/* Group Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Group Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Group Information</h3>
              <div className="flex flex-col gap-2">
                <p><span className="font-medium">Name:</span> {currentUser?.name || ''}</p>
                <p><span className="font-medium">Email:</span> {currentUser?.email || ''}</p>
                <p><span className="font-medium">Description:</span> {currentUser?.description || ''}</p>
                <p><span className="font-medium">Role:</span> 
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                    {currentUser?.role || ''}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {loadingGroup ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              ) : (
                memberCount
              )}
            </div>
            <div className="text-gray-600">Members</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {loadingGroup ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
              ) : (
                eventCount
              )}
            </div>
            <div className="text-gray-600">Events</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">Active</div>
            <div className="text-gray-600">Status</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="flex flex-col gap-6">
            {loadingGroup ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading activity...</p>
              </div>
            ) : recentMembers.length === 0 && recentEvents.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
                <p className="text-gray-600">Start by adding members and creating events for your group!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Recent Members */}
                {recentMembers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Members</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {recentMembers.map((member) => (
                        <div key={member.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-600">
                            Age: {member.age} • {member.gender}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Events */}
                {recentEvents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Events</h3>
                    <div className="space-y-3">
                      {recentEvents.map((event) => (
                        <div key={event.id} className="bg-blue-50 rounded-lg p-4">
                          <div className="font-medium text-gray-900">{event.name}</div>
                          <div className="text-sm text-gray-600">
                            📍 {event.location} • 🕐 {formatEventTime(event.time)} • 📏 {event.distance} km
                          </div>
                          <div className="mt-2">
                            <span className="text-xs font-medium text-blue-800">Pace Groups:</span>
                            <div className="mt-1">
                              {event.paceGroups.map((pace, index) => (
                                <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                                  {pace}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 