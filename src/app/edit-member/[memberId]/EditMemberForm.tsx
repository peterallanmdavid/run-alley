'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateMember } from '@/lib/api';
import { Member } from '@/lib/data';

interface EditMemberFormProps {
  member: Member;
  groupId: string;
}

export default function EditMemberForm({ member, groupId }: EditMemberFormProps) {
  const [name, setName] = useState(member.name);
  const [age, setAge] = useState(member.age);
  const [gender, setGender] = useState(member.gender);
  const [email, setEmail] = useState(member.email || '');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMember(groupId, member.id, { name, age, gender, email: email || undefined });
      router.push('/my-members');
    } catch (err) {
      alert('Failed to update member');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Edit Member</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Member Name</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Age</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={age} 
                onChange={e => setAge(e.target.value)} 
                required 
                type="number" 
                min="1" 
                max="120" 
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Gender</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={gender} 
                onChange={e => setGender(e.target.value)} 
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Email Address (Optional)</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                type="email" 
                placeholder="member@example.com"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => router.push('/my-members')}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200" 
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 