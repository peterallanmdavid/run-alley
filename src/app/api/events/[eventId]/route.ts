import { NextRequest, NextResponse } from 'next/server';
import { getEventById } from '@/lib/supabase-data';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    let isAuthenticated = false;
    if (token) {
      try {
        await verifyJWT(token);
        isAuthenticated = true;
      } catch (error) {
        // Token is invalid, treat as unauthenticated
      }
    }

    const event = await getEventById(eventId);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // For unauthenticated users, remove secret keys and participants
    if (!isAuthenticated) {
      const { secretKey, participants, ...publicEvent } = event;
      return NextResponse.json({
        ...publicEvent,
        participants: participants ? participants.length : 0 // Only return count, not details
      });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
} 