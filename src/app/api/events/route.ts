import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents } from '@/lib/supabase-data';

export async function GET(request: NextRequest) {
  try {
    const events = await getAllEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching all events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 