import { redirect } from 'next/navigation';
import { getCurrentUserServer, getEventsServer } from '@/lib/server-utils';
import { updateEvent } from '@/lib/api';
import EditEventForm from './EditEventForm';

export default async function EditEventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const currentUser = await getCurrentUserServer();
  if (!currentUser) {
    redirect('/login');
  }

  // Get the specific event
  const { eventId } = await params;
  const events = await getEventsServer(currentUser.group.id);
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    redirect('/my-events');
  }

  return <EditEventForm event={event} groupId={currentUser.group.id} />;
} 