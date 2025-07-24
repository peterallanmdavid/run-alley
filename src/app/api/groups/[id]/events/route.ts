import { NextRequest, NextResponse } from 'next/server';
import { getEvents, addEvent } from '@/lib/supabase-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events = await getEvents(id);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { name, location, time, distance, paceGroups } = body;

    if (!name || !location || !time || !distance || !paceGroups || !Array.isArray(paceGroups)) {
      return NextResponse.json(
        { error: 'Name, location, time, distance, and paceGroups array are required' },
        { status: 400 }
      );
    }

    const { id } = await params;
    const newEvent = await addEvent(id, { name, location, time, distance, paceGroups });
    
    if (!newEvent) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error adding event:', error);
    return NextResponse.json(
      { error: 'Failed to add event' },
      { status: 500 }
    );
  }
} 