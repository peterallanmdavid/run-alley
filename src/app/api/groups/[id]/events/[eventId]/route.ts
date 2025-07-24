import { NextRequest, NextResponse } from 'next/server';
import { removeEvent } from '@/lib/data';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; eventId: string }> }
) {
  try {
    const { id, eventId } = await params;
    const success = await removeEvent(id, eventId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Group or event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Event removed successfully' });
  } catch (error) {
    console.error('Error removing event:', error);
    return NextResponse.json(
      { error: 'Failed to remove event' },
      { status: 500 }
    );
  }
} 