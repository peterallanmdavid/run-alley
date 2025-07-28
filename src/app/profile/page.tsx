import { redirect } from 'next/navigation';
import { getCurrentUserServer } from '@/lib/server-utils';
import { getGroup } from '@/lib/supabase-data';
import { Button, ContainerCard } from '@/components';
import Link from 'next/link';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const currentUser = await getCurrentUserServer();
  
  if (!currentUser) {
    redirect('/login');
  }

  if (currentUser.group.role !== 'GroupOwner') {
    redirect('/admin');
  }

  // Get group data with member and event counts
  const group = await getGroup(currentUser.group.id);

  if (!group) {
    redirect('/login');
  }

  return (
    <ProfileClient 
      currentUser={currentUser.group}
      group={group}
    />
  );
} 