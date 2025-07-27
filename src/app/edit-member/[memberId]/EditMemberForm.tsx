'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateMember } from '@/lib/api';
import { Member } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components';
import { GenderDropdown } from '@/components/GenderDropdown';

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
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">Edit Member</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm sm:text-base">Member Name</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm sm:text-base">Age</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base" 
                value={age} 
                onChange={e => setAge(e.target.value)} 
                required 
                type="number" 
                min="1" 
                max="120" 
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm sm:text-base">Gender</label>
              <GenderDropdown gender={gender} setGender={setGender} />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm sm:text-base">Email Address (Optional)</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                type="email" 
                placeholder="member@example.com"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Link href="/my-members" className='flex-1'>
                <Button variant="secondary" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Updating...' : 'Update Member'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 