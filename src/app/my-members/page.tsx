import Link from 'next/link';
import { Button, ContainerCard } from '@/components';
import { getCurrentUserServer, getMembersServer } from '@/lib/server-utils';
import { Member } from '@/lib/data';
import { redirect } from 'next/navigation';
import RemoveMemberButton from './RemoveMemberButton';

export default async function MyMembersPage() {
  const currentUser = await getCurrentUserServer();
  
  if (!currentUser) {
    redirect('/login');
  }

  let members: Member[] = [];

  try {
    members = await getMembersServer(currentUser.group.id);
  } catch (error) {
    console.error('Error fetching members:', error);
  }

  const buttonBase = "font-semibold rounded-xl transition duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  const buttonPrimary = "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonLg = "px-8 py-4 text-lg w-full";

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Members</h1>
          </div>
          <Link href="/add-member">
            <span className={`${buttonBase} ${buttonPrimary} text-sm px-4 py-2 rounded-lg`}>Add Member</span>
          </Link>
        </div>

        {members.length === 0 ? (
          <ContainerCard className="p-12 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Members Yet</h2>
              <p className="text-gray-600 mb-6">Add your first member to your run group!</p>
            </div>
            <Link href="/add-member">
              <span className={`${buttonBase} ${buttonPrimary} ${buttonLg} block text-center cursor-pointer`}>
                Add Your First Member
              </span>
            </Link>
          </ContainerCard>
        ) : (
          <ContainerCard>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Members</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {members.map((member) => (
                <div key={member.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">
                          Age: {member.age} • Gender: {member.gender}
                          {member.email && ` • 📧 ${member.email}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      #{member.id.slice(-4)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/edit-member/${member.id}`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1 rounded-md transition-colors duration-200">
                          Edit
                        </button>
                      </Link>
                      <RemoveMemberButton 
                        memberId={member.id} 
                        groupId={currentUser.group.id} 
                        memberName={member.name} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ContainerCard>
        )}
      </div>
    </div>
  );
} 