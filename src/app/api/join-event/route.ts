import { NextRequest, NextResponse } from 'next/server';
import { addNewMemberAndParticipantAction, addParticipantAction } from '@/lib/actions';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secretCode, memberData, memberId } = body;

    if (!secretCode) {
      return NextResponse.json(
        { error: 'Secret code is required' },
        { status: 400 }
      );
    }

    // First, get the event by secret code to get the groupId
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, group_id, secret_key')
      .eq('secret_key', secretCode)
      .single();

    if (eventError || !event || event.secret_key !== secretCode) {
      return NextResponse.json(
        { error: 'Invalid secret code' },
        { status: 400 }
      );
    }

    // Check if member is already a participant (for existing members)
    if (memberId) {
      const { data: existingParticipant, error: participantError } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', event.id)
        .eq('member_id', memberId)
        .single();

      if (participantError && participantError.code !== 'PGRST116') {
        // PGRST116 means no rows found, which is what we want
        console.error('Error checking existing participant:', participantError);
        return NextResponse.json(
          { error: 'Failed to check existing participation' },
          { status: 500 }
        );
      }

      if (existingParticipant) {
        return NextResponse.json(
          { error: 'You are already a participant in this event' },
          { status: 400 }
        );
      }
    }

    let result;

    if (memberId) {
      // Join with existing member
      result = await addParticipantAction(event.id, memberId, secretCode);
    } else if (memberData) {
      // Create new member and join
      result = await addNewMemberAndParticipantAction(
        event.id,
        secretCode,
        event.group_id,
        memberData
      );
    } else {
      return NextResponse.json(
        { error: 'Either memberId or memberData is required' },
        { status: 400 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to join event' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined event' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error joining event:', error);
    return NextResponse.json(
      { error: 'Failed to join event' },
      { status: 500 }
    );
  }
} 