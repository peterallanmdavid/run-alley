import { supabase } from './supabase';
import { RunGroup, Member, GroupEvent } from './data';

// Group operations
export async function createGroup(groupData: { name: string; description: string }): Promise<RunGroup> {
  const { data, error } = await supabase
    .from('groups')
    .insert({
      name: groupData.name,
      description: groupData.description,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    createdAt: data.created_at,
    members: [],
    events: []
  };
}

export async function getGroups(): Promise<RunGroup[]> {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(group => ({
    id: group.id,
    name: group.name,
    description: group.description,
    createdAt: group.created_at,
    members: [],
    events: []
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
    description: data.description,
    createdAt: data.created_at,
    members,
    events
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
    description: data.description,
    createdAt: data.created_at,
    members: [],
    events: []
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
export async function addMember(groupId: string, memberData: { name: string; age: string; gender: string }): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .insert({
      group_id: groupId,
      name: memberData.name,
      age: memberData.age,
      gender: memberData.gender
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    age: data.age,
    gender: data.gender
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
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data.map(member => ({
    id: member.id,
    name: member.name,
    age: member.age,
    gender: member.gender
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