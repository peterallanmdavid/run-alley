import { Button} from '@/components';

import { getGroups } from '@/lib/supabase-data';
import { GroupActions } from './GroupActions';
import Link from 'next/link';

interface Group {
  id: string;
  name: string;
  email: string;
  description: string;
  createdAt: string;
  role: 'Admin' | 'GroupOwner';
}

export default async function AdminPage() {
  // Fetch groups server-side
  const groups = await getGroups();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <div className="flex gap-2">
            <Link href="/admin/create-group" className="bg-blue-500 text-white px-4 py-2 rounded-md">Create Group</Link>
          </div>
        </div>

        {/* Groups List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Groups</h2>
          {groups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Groups Yet</h3>
              <p className="text-gray-600">Create your first group to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <div key={group.id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                      <p className="text-gray-600">{group.email}</p>
                    </div>
                    <GroupActions group={group} />
                  </div>
                  <p className="text-gray-700 mb-2">{group.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Created: {new Date(group.createdAt).toLocaleDateString()}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {group.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 