import { NextRequest, NextResponse } from 'next/server';
import { addEventParticipant, getEventParticipants } from '@/lib/supabase-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const participants = await getEventParticipants(eventId);
    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const { memberId, secretKey } = body;

    if (!memberId || !secretKey) {
      return NextResponse.json(
        { error: 'Member ID and secret key are required' },
        { status: 400 }
      );
    }

    const participant = await addEventParticipant(eventId, memberId, secretKey);
    
    if (!participant) {
      return NextResponse.json(
        { error: 'Failed to add participant' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error('Error adding participant:', error);
    return NextResponse.json(
      { error: 'Failed to add participant' },
      { status: 500 }
    );
  }
} 