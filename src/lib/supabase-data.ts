import { supabase } from './supabase';
import { RunGroup, Member, GroupEvent } from './data';
import bcrypt from 'bcryptjs';

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
  // Fetch groups
  const { data: groups, error } = await supabase
    .from('groups')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;

  // Fetch member counts
  const { data: memberCountsRaw, error: memberError } = await supabase
    .from('members')
    .select('group_id', { count: 'exact', head: false });
  if (memberError) throw memberError;
  const memberCounts: Record<string, number> = {};
  memberCountsRaw?.forEach((row: { group_id: string }) => {
    memberCounts[row.group_id] = (memberCounts[row.group_id] || 0) + 1;
  });

  // Fetch event counts
  const { data: eventCountsRaw, error: eventError } = await supabase
    .from('events')
    .select('group_id', { count: 'exact', head: false });
  if (eventError) throw eventError;
  const eventCounts: Record<string, number> = {};
  eventCountsRaw?.forEach((row: { group_id: string }) => {
    eventCounts[row.group_id] = (eventCounts[row.group_id] || 0) + 1;
  });

  return groups.map(group => ({
    id: group.id,
    name: group.name,
    email: group.email,
    description: group.description,
    createdAt: group.created_at,
    members: [],
    events: [],
    firstLogin: group.firstLogin ?? group.first_login ?? false,
    role: group.role || 'GroupOwner',
    memberCount: memberCounts[group.id] || 0,
    eventCount: eventCounts[group.id] || 0
  }));
}

export async function getGroup(id: string): Promise<RunGroup | null> {
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
  const { data, error } = await supabase
    .from('events')
    .insert({
      group_id: groupId,
      name: eventData.name,
      location: eventData.location,
      time: eventData.time,
      distance: eventData.distance,
      pace_groups: eventData.paceGroups,
      created_at: new Date().toISOString()
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
    paceGroups: data.pace_groups,
    createdAt: data.created_at
  };
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
    paceGroups: event.pace_groups,
    createdAt: event.created_at
  }));
}

export async function getAllEvents(): Promise<Array<GroupEvent & { groupName: string; groupId: string }>> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      groups!inner(name)
    `)
    .order('time', { ascending: true });

  if (error) throw error;

  return data.map(event => ({
    id: event.id,
    name: event.name,
    location: event.location,
    time: event.time,
    distance: event.distance,
    paceGroups: event.pace_groups,
    createdAt: event.created_at,
    groupName: event.groups.name,
    groupId: event.group_id
  }));
} 