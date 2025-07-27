import { RunGroup, Member, GroupEvent } from './data';
import { supabase } from './supabase';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

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

    // Check if session exists in DB
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('token', token)
      .single();
    if (sessionError || !session) {
      return null;
    }

    // Fetch current user data from database
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', decoded.id)
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

    console.log('Raw member data from database:', data);

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

export async function getEventsServer(groupId: string): Promise<GroupEvent[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('group_id', groupId)
      .order('time', { ascending: true });

    if (error) throw error;

    return data.map(event => ({
      id: event.id,
      name: event.name,
      location: event.location,
      time: event.time,
      distance: event.distance,
      paceGroups: event.pace_groups || [],
      createdAt: event.created_at,
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
} 