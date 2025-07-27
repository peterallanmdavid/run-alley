import { redirect } from 'next/navigation';
import { getCurrentUserServer, getEventsServer, getMembersServer } from '@/lib/server-utils';
import EditEventForm from './EditEventForm';

export default async function EditEventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const currentUser = await getCurrentUserServer();
  if (!currentUser) {
    redirect('/login');
  }

  // Get the specific event
  const { eventId } = await params;
  const events = await getEventsServer(currentUser.group.id, currentUser);
  const event = events.find(e => e.id === eventId);

  if (!event) {
    redirect('/my-events');
  }

  // Get members for the Add Participants functionality
  const members = await getMembersServer(currentUser.group.id);

  return (
    <EditEventForm 
      event={event} 
      groupId={currentUser.group.id}
      members={members}
      currentParticipants={event.participants?.map(p => ({ memberId: p.memberId })) || []}
    />
  );
} 