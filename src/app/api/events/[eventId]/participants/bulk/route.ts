import { NextRequest, NextResponse } from 'next/server';
import { addEventParticipant } from '@/lib/supabase-data';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();
    const { memberIds, secretKey } = body;

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return NextResponse.json(
        { error: 'Member IDs array is required' },
        { status: 400 }
      );
    }

    if (!secretKey) {
      return NextResponse.json(
        { error: 'Secret key is required' },
        { status: 400 }
      );
    }

    // Add all participants
    const results = [];
    const errors = [];

    for (const memberId of memberIds) {
      try {
        const participant = await addEventParticipant(eventId, memberId, secretKey);
        if (participant) {
          results.push(participant);
        }
      } catch (error) {
        errors.push({ memberId, error: error instanceof Error ? error.message : 'Failed to add participant' });
      }
    }

    return NextResponse.json({
      success: results.length > 0,
      added: results,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        total: memberIds.length,
        added: results.length,
        failed: errors.length
      }
    }, { status: results.length > 0 ? 201 : 400 });
  } catch (error) {
    console.error('Error adding multiple participants:', error);
    return NextResponse.json(
      { error: 'Failed to add participants' },
      { status: 500 }
    );
  }
} 