import { NextRequest, NextResponse } from 'next/server';
import { removeEventParticipant } from '@/lib/supabase-data';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; participantId: string }> }
) {
  try {
    const { eventId, participantId } = await params;
    const success = await removeEventParticipant(eventId, participantId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Participant removed successfully' });
  } catch (error) {
    console.error('Error removing participant:', error);
    return NextResponse.json(
      { error: 'Failed to remove participant' },
      { status: 500 }
    );
  }
} 