import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ 'secret-code': string }> }
) {
  try {
    const { 'secret-code': secretCode } = await params;
    
    // First get the event to find the group_id and event_id
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, group_id')
      .eq('secret_key', secretCode)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Get all members for this group
    const { data: allMembers, error: membersError } = await supabase
      .from('members')
      .select('id, name, age, gender, email')
      .eq('group_id', event.group_id)
      .order('name', { ascending: true });

    if (membersError) {
      console.error('Error fetching members:', membersError);
      return NextResponse.json(
        { error: 'Failed to fetch members' },
        { status: 500 }
      );
    }

    // Get existing participants for this event
    const { data: existingParticipants, error: participantsError } = await supabase
      .from('event_participants')
      .select('member_id')
      .eq('event_id', event.id);

    if (participantsError) {
      console.error('Error fetching participants:', participantsError);
      return NextResponse.json(
        { error: 'Failed to fetch participants' },
        { status: 500 }
      );
    }

    // Filter out members who are already participants
    const existingParticipantIds = existingParticipants?.map(p => p.member_id) || [];
    const availableMembers = allMembers?.filter(member => 
      !existingParticipantIds.includes(member.id)
    ) || [];

    return NextResponse.json(availableMembers);
  } catch (error) {
    console.error('Error fetching members by secret code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
} 