'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, TextArea } from '@/components';

// Mock data (should be replaced with real backend fetch)
const mockGroups = [
  {
    id: '1',
    name: 'Morning Runners',
    email: 'morning@run.com',
    description: 'Early birds unite!',
    createdAt: '2024-06-01T08:00:00Z',
  },
  {
    id: '2',
    name: 'Night Owls',
    email: 'night@run.com',
    description: 'Late night running group.',
    createdAt: '2024-06-02T21:00:00Z',
  },
];

export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;
  const [form, setForm] = useState({ name: '', email: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Simulate fetch
    const group = mockGroups.find(g => g.id === groupId);
    if (group) {
      setForm({ name: group.name, email: group.email, description: group.description });
    }
    setLoading(false);
  }, [groupId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to backend
    setSuccess(true);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Group</h2>
        {success ? (
          <div className="text-center">
            <div className="text-green-600 text-lg font-semibold mb-4">Group updated!</div>
            <Button onClick={() => router.push('/admin')}>Back to Admin</Button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              id="edit-name"
              name="name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Group Name"
              required
            />
            <Input
              id="edit-email"
              name="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="Group Email (unique)"
              required
              type="email"
            />
            <TextArea
              id="edit-description"
              name="description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Description"
              rows={3}
            />
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => router.push('/admin')} className="flex-1">Cancel</Button>
              <Button type="submit" variant="primary" className="flex-1">Save</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 