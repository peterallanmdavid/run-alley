import { redirect } from 'next/navigation';
import { getCurrentUserServer, getMembersServer } from '@/lib/server-utils';
import { updateMember } from '@/lib/api';
import EditMemberForm from './EditMemberForm';

export default async function EditMemberPage({ params }: { params: { memberId: string } }) {
  const currentUser = await getCurrentUserServer();
  if (!currentUser) {
    redirect('/login');
  }

  // Get the specific member
  const members = await getMembersServer(currentUser.group.id);
  const member = members.find(m => m.id === params.memberId);
  
  if (!member) {
    redirect('/my-members');
  }

  return <EditMemberForm member={member} groupId={currentUser.group.id} />;
} 