import { getCurrentUserServer, getMembersServer, getEventsServer } from '@/lib/server-utils';
import { redirect } from 'next/navigation';
import ManageGroupClient from './ManageGroupClient';

export default async function ManageGroupPage() {
  const currentUser = await getCurrentUserServer();
  
  if (!currentUser) {
    redirect('/login');
  }

  // Get latest 5 members and 5 events
  const [members, events] = await Promise.all([
    getMembersServer(currentUser.group.id),
    getEventsServer(currentUser.group.id)
  ]);

  const latestMembers = members.slice(0, 5);
  const latestEvents = events.slice(0, 5);

  const group = {
    id: currentUser.group.id,
    name: currentUser.group.name,
    email: currentUser.group.email,
    description: currentUser.group.description || '',
    createdAt: new Date().toISOString(),
    members: latestMembers,
    events: latestEvents,
    firstLogin: false,
    role: currentUser.group.role
  };

  return (
    <ManageGroupClient 
      group={group} 
      currentUser={currentUser}
      totalMembers={members.length}
      totalEvents={events.length}
    />
  );
} 