'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateEvent } from '@/lib/api';
import { PaceGroupsSelect } from '@/components';
import { GroupEvent } from '@/lib/data';

interface EditEventFormProps {
  event: GroupEvent;
  groupId: string;
}

export default function EditEventForm({ event, groupId }: EditEventFormProps) {
  const [name, setName] = useState(event.name);
  const [location, setLocation] = useState(event.location);
  const [time, setTime] = useState(event.time);
  const [distance, setDistance] = useState(event.distance);
  const [paceGroups, setPaceGroups] = useState<string[]>(event.paceGroups);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEvent(groupId, event.id, { name, location, time, distance, paceGroups });
      router.push('/my-events');
    } catch (err) {
      alert('Failed to update event');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Edit Event</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Event Name</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Location</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Date & Time</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={time} 
                onChange={e => setTime(e.target.value)} 
                required 
                type="datetime-local" 
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Distance (km)</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={distance} 
                onChange={e => setDistance(e.target.value)} 
                required 
                type="number" 
                min="0.1" 
                max="100" 
                step="0.1" 
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Pace Groups</label>
              <PaceGroupsSelect value={paceGroups} onChange={setPaceGroups} />
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => router.push('/my-events')}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200" 
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 