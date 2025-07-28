import { cookies } from 'next/headers';
import { supabase } from './supabase';
import { RunGroup, Member, GroupEvent, EventParticipant } from './data';
import { getEventParticipants } from './supabase-data';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function getCurrentUserServer(): Promise<{ group: RunGroup & { email: string; role: 'Admin' | 'GroupOwner' } } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session-token')?.value;
    
    if (!token) {
      return null;
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as {
      id: string;
      email: string;
      role: 'Admin' | 'GroupOwner';
      name: string;
    };

    // Fetch current user data from database with session validation in a single query
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        sessions!inner(token)
      `)
      .eq('id', decoded.id)
      .eq('sessions.token', token)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      group: {
        id: data.id,
        name: data.name,
        email: data.email,
        description: data.description,
        createdAt: data.created_at,
        members: [],
        events: [],
        firstLogin: data.first_login,
        role: data.role || 'GroupOwner',
      }
    };
  } catch (error) {
    console.error('Error in getCurrentUserServer:', error);
    return null;
  }
}

export async function getMembersServer(groupId: string): Promise<Member[]> {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(member => ({
      id: member.id,
      name: member.name,
      age: member.age,
      gender: member.gender,
      email: member.email,
    }));
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}

export async function getEventsServer(groupId: string, currentUser?: { group: { id: string } }): Promise<GroupEvent[]> {
  try {
    // Check if the current user owns this group
    const isOwner = currentUser && currentUser.group.id === groupId;

    let query = supabase
      .from('events')
      .select('*')
      .eq('group_id', groupId)
      .order('time', { ascending: true });

    // Only fetch participants if user owns the group
    if (isOwner) {
      query = supabase
        .from('events')
        .select(`
          *,
          event_participants(
            id,
            member_id,
            created_at,
            member:members(
              id,
              name,
              age,
              gender,
              email
            )
          )
        `)
        .eq('group_id', groupId)
        .order('time', { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map((event) => {
      let participants: EventParticipant[] = [];
      let secretKey: string | undefined = undefined;

      if (isOwner) {
        // Only include participants and secret key for group owners
        participants = event.event_participants?.map((participant: {
          id: string;
          member_id: string;
          created_at: string;
          member: {
            id: string;
            name: string;
            age: string;
            gender: string;
            email: string | null;
          };
        }) => ({
          id: participant.id,
          eventId: event.id,
          memberId: participant.member_id,
          member: {
            id: participant.member.id,
            name: participant.member.name,
            age: participant.member.age,
            gender: participant.member.gender,
            email: participant.member.email,
          },
          createdAt: participant.created_at,
        })) || [];
        secretKey = event.secret_key;
      }

      return {
        id: event.id,
        name: event.name,
        location: event.location,
        time: event.time,
        distance: event.distance,
        paceGroups: event.pace_groups || [],
        createdAt: event.created_at,
        participants,
        secretKey,
      };
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
} 

export async function getEventBySecretCodeServer(secretCode: string) {
  // Fetch event by secret code, including group name
  const { data: event, error } = await supabase
    .from('events')
    .select('*, groups(name)')
    .eq('secret_key', secretCode)
    .single();

  if (error || !event) return null;

  return {
    id: event.id,
    name: event.name,
    location: event.location,
    time: event.time,
    distance: event.distance,
    paceGroups: event.pace_groups || [],
    createdAt: event.created_at,
    groupName: event.groups?.name || '',
    groupId: event.group_id,
    // No participants or secretKey for public
  };
} 