import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents } from '@/lib/supabase-data';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
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

    const events = await getAllEvents();
    
    // For unauthenticated users, remove secret keys and participants
    const publicEvents = events.map(event => {
      if (!isAuthenticated) {
        const { secretKey, participants, ...publicEvent } = event;
        return {
          ...publicEvent,
          participants: participants ? participants.length : 0 // Only return count, not details
        };
      }
      return event;
    });

    return NextResponse.json(publicEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 