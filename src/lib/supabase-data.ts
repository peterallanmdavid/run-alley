import { supabase } from './supabase';
import { RunGroup, Member, GroupEvent, EventParticipant } from './data';
import bcrypt from 'bcryptjs';
import { connection } from 'next/server';

// Group operations
export async function createGroup(groupData: { name: string; description: string; email: string; role?: 'Admin' | 'GroupOwner' }): Promise<{ group: RunGroup; tempPassword: string }> {
  // Generate a random temp password
  const tempPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const { data, error } = await supabase
    .from('groups')
    .insert({
      name: groupData.name,
      description: groupData.description,
      email: groupData.email,
      password: hashedPassword,
      first_login: true,
      created_at: new Date().toISOString(),
      role: groupData.role || 'GroupOwner',
    })
    .select()
    .single();

  if (error) throw error;

  const group: RunGroup = {
    id: data.id,
    name: data.name,
    email: data.email,
    description: data.description,
    createdAt: data.created_at,
    members: [],
    events: [],
    firstLogin: data.firstLogin ?? data.first_login ?? false,
    role: data.role || 'GroupOwner',
  };

  return { group, tempPassword };
}

export async function getGroups(): Promise<(RunGroup & { memberCount: number; eventCount: number })[]> {
  await connection();
  
  // Use a single query with joins to get groups and their counts
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      members!inner(count),
      events!inner(count)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(group => ({
    id: group.id,
    name: group.name,
    email: group.email,
    description: group.description,
    createdAt: group.created_at,
    members: [],
    events: [],
    firstLogin: group.firstLogin ?? group.first_login ?? false,
    role: group.role || 'GroupOwner',
    memberCount: group.members?.[0]?.count || 0,
    eventCount: group.events?.[0]?.count || 0
  }));
}

export async function getGroup(id: string): Promise<RunGroup | null> {
  await connection();
  
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }

  // Get members and events for this group
  const [members, events] = await Promise.all([
    getMembers(id),
    getEvents(id)
  ]);

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    description: data.description,
    createdAt: data.created_at,
    members,
    events,
    firstLogin: data.firstLogin ?? data.first_login ?? false,
    role: data.role || 'GroupOwner',
  };
}

export async function updateGroup(id: string, updates: { name: string; description: string }): Promise<RunGroup | null> {
  const { data, error } = await supabase
    .from('groups')
    .update({
      name: updates.name,
      description: updates.description
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    description: data.description,
    createdAt: data.created_at,
    members: [],
    events: [],
    firstLogin: data.firstLogin ?? data.first_login ?? false,
    role: data.role || 'GroupOwner',
  };
}

export async function deleteGroup(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// Member operations
export async function addMember(groupId: string, memberData: { name: string; age: string; gender: string; email?: string }): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .insert({
      name: memberData.name,
      age: memberData.age,
      gender: memberData.gender,
      email: memberData.email || null,
      group_id: groupId,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    age: data.age,
    gender: data.gender,
    email: data.email,
  };
}

export async function updateMember(groupId: string, memberId: string, updates: { name?: string; age?: string; gender?: string; email?: string }): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .update({
      name: updates.name,
      age: updates.age,
      gender: updates.gender,
      email: updates.email || null,
    })
    .eq('id', memberId)
    .eq('group_id', groupId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    age: data.age,
    gender: data.gender,
    email: data.email,
  };
}

export async function removeMember(groupId: string, memberId: string): Promise<boolean> {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', memberId)
    .eq('group_id', groupId);

  if (error) throw error;
  return true;
}

export async function getMembers(groupId: string): Promise<Member[]> {
  await connection();
  
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((member) => ({
    id: member.id,
    name: member.name,
    age: member.age,
    gender: member.gender,
    email: member.email,
  }));
}

// Event operations
export async function addEvent(groupId: string, eventData: { name: string; location: string; time: string; distance: string; paceGroups: string[] }): Promise<GroupEvent | null> {
  // Generate a secret key for the event
  const secretKey = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  const { data, error } = await supabase
    .from('events')
    .insert({
      name: eventData.name,
      location: eventData.location,
      time: eventData.time,
      distance: eventData.distance,
      pace_groups: eventData.paceGroups,
      group_id: groupId,
      secret_key: secretKey,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    location: data.location,
    time: data.time,
    distance: data.distance,
    paceGroups: data.pace_groups || [],
    createdAt: data.created_at,
    secretKey: data.secret_key,
  };
}

export async function addEventParticipant(eventId: string, memberId: string, secretKey: string): Promise<EventParticipant | null> {
  // First verify the secret key
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('secret_key')
    .eq('id', eventId)
    .single();

  if (eventError || !event || event.secret_key !== secretKey) {
    throw new Error('Invalid secret key');
  }

  // Add the participant
  const { data, error } = await supabase
    .from('event_participants')
    .insert({
      event_id: eventId,
      member_id: memberId,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  // Get the member details
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('*')
    .eq('id', memberId)
    .single();

  if (memberError) throw memberError;

  return {
    id: data.id,
    eventId: data.event_id,
    memberId: data.member_id,
    member: {
      id: member.id,
      name: member.name,
      age: member.age,
      gender: member.gender,
      email: member.email,
    },
    createdAt: data.created_at,
  };
}

export async function getEventBySecretCode(secretCode: string): Promise<GroupEvent | null> {
  await connection();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('secret_key', secretCode)
    .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      location: data.location,
      time: data.time,
      distance: data.distance,
      paceGroups: data.paceGroups,
      createdAt: data.created_at,
      secretKey: data.secret_key,
    };
}

export async function getEventParticipants(eventId: string): Promise<EventParticipant[]> {
  await connection();
  
  const { data, error } = await supabase
    .from('event_participants')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Get member details for each participant
  const participantsWithMembers = await Promise.all(
    data.map(async (participant) => {
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', participant.member_id)
        .single();

      if (memberError) throw memberError;

      return {
        id: participant.id,
        eventId: participant.event_id,
        memberId: participant.member_id,
        member: {
          id: member.id,
          name: member.name,
          age: member.age,
          gender: member.gender,
          email: member.email,
        },
        createdAt: participant.created_at,
      };
    })
  );

  return participantsWithMembers;
}

export async function removeEvent(groupId: string, eventId: string): Promise<boolean> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('group_id', groupId);

  if (error) throw error;
  return true;
}

export async function updateEvent(groupId: string, eventId: string, updates: { name?: string; location?: string; time?: string; distance?: string; paceGroups?: string[] }): Promise<GroupEvent | null> {
  const { data, error } = await supabase
    .from('events')
    .update({
      name: updates.name,
      location: updates.location,
      time: updates.time,
      distance: updates.distance,
      pace_groups: updates.paceGroups,
    })
    .eq('id', eventId)
    .eq('group_id', groupId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    location: data.location,
    time: data.time,
    distance: data.distance,
    paceGroups: data.pace_groups || [],
    createdAt: data.created_at,
  };
}

export async function getEvents(groupId: string): Promise<GroupEvent[]> {
  await connection();
  
  const { data, error } = await supabase
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

  if (error) throw error;

  return data.map((event) => ({
    id: event.id,
    name: event.name,
    location: event.location,
    time: event.time,
    distance: event.distance,
    paceGroups: event.pace_groups || [],
    createdAt: event.created_at,
    secretKey: event.secret_key,
    participants: event.event_participants?.map((participant: {
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
    })) || [],
  }));
}

export async function getAllEvents(): Promise<Array<GroupEvent & { groupName: string; groupId: string }>> {
  await connection();
  
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      group:groups(name),
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
    .order('time', { ascending: true });

  if (error) throw error;

  return data.map((event) => ({
    id: event.id,
    name: event.name,
    location: event.location,
    time: event.time,
    distance: event.distance,
    paceGroups: event.pace_groups || [],
    createdAt: event.created_at,
    secretKey: event.secret_key,
    participants: event.event_participants?.map((participant: {
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
    })) || [],
    groupName: event.group.name,
    groupId: event.group_id,
  }));
} 

export async function removeEventParticipant(eventId: string, participantId: string): Promise<boolean> {
  const { error } = await supabase
    .from('event_participants')
    .delete()
    .eq('id', participantId)
    .eq('event_id', eventId);

  if (error) throw error;
  return true;
} 

export async function getEventById(eventId: string): Promise<(GroupEvent & { groupName: string; groupId: string }) | null> {
  await connection();
  
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      group:groups(name),
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
    .eq('id', eventId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    location: data.location,
    time: data.time,
    distance: data.distance,
    paceGroups: data.pace_groups || [],
    createdAt: data.created_at,
    secretKey: data.secret_key,
    participants: data.event_participants?.map((participant: {
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
      eventId: data.id,
      memberId: participant.member_id,
      member: {
        id: participant.member.id,
        name: participant.member.name,
        age: participant.member.age,
        gender: participant.member.gender,
        email: participant.member.email,
      },
      createdAt: participant.created_at,
    })) || [],
    groupName: data.group.name,
    groupId: data.group_id,
  };
} 

