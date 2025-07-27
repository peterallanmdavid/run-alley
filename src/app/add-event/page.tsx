import { redirect } from 'next/navigation';
import { getCurrentUserServer } from '@/lib/server-utils';
import AddEventForm from './AddEventForm';


export default async function AddEventPage() {
  const currentUser = await getCurrentUserServer();
  if (!currentUser) {
    redirect('/login');
  }
  
  return <AddEventForm groupId={currentUser.group.id} />;
} 