import Link from 'next/link';
import { Button, ContainerCard, ActionButton } from '@/components';
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
  const buttonLg = "px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full";

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Members</h1>
          <Link href="/add-member">
            <Button variant="primary" className="w-full sm:w-auto">Add Member</Button>
          </Link>
        </div>

        {members.length === 0 ? (
          <ContainerCard className="p-8 sm:p-12 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Members Yet</h2>
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
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Members</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {members.map((member) => (
                <div key={member.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Member Info */}
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0 mt-1">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight mb-1">{member.name}</h3>
                        
                        {/* Email - only show if exists */}
                        {member.email && (
                          <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">
                            {member.email}
                          </p>
                        )}
                        
                        {/* Age and Gender */}
                        <p className="text-xs sm:text-sm text-gray-600">
                          Age: {member.age} • Gender: {member.gender}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 sm:gap-2 sm:flex-shrink-0 justify-end">
                      <Link href={`/edit-member/${member.id}`}>
                        <ActionButton variant="primary">
                          Edit
                        </ActionButton>
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