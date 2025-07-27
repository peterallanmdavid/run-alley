import { redirect } from 'next/navigation';
import { getCurrentUserServer } from '@/lib/server-utils';
import AddMemberForm from './AddMemberForm';

export default async function AddMemberPage() {
  const currentUser = await getCurrentUserServer();
  if (!currentUser) {
    redirect('/login');
  }
  
  return <AddMemberForm groupId={currentUser.group.id} />;
} 