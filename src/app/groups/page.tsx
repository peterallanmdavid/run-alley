import Link from 'next/link';
import { Button, GroupCard } from '@/components';
import { getGroups } from '@/lib/supabase-data';
import { RunGroup } from '@/lib/data';

export default async function GroupsPage() {
  const groups: (RunGroup & { memberCount: number; eventCount: number })[] = await getGroups();

  const buttonBase = "font-semibold rounded-xl transition duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonLg = "px-8 py-4 text-lg w-full";

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900">View Run Groups</h1>
          </div>
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
            <Link href="/admin/create-group">
              <span className={`${buttonBase} ${buttonPrimary} ${buttonLg} block text-center cursor-pointer`}>
                Create Your First Group
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Link key={group.id} href={`/groups/${group.id}`} className="block">
                <GroupCard
                  group={group}
                  memberCount={group.memberCount}
                  eventCount={group.eventCount}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 