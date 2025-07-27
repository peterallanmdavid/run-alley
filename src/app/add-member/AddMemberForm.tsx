'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addMember } from '@/lib/api';

interface AddMemberFormProps {
  groupId: string;
}

export default function AddMemberForm({ groupId }: AddMemberFormProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await addMember(groupId, { name, age, gender });
      router.push('/my-members');
    } catch (err) {
      alert('Failed to add member');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Add Member</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Name</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Age</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={age} onChange={e => setAge(e.target.value)} required type="number" min="1" max="120" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Gender</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={gender} onChange={e => setGender(e.target.value)} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200" disabled={loading}>
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 