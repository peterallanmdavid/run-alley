import fs from 'fs/promises';
import path from 'path';

export interface Member {
  id: string;
  name: string;
  age: string;
  gender: string;
}

export interface GroupEvent {
  id: string;
  name: string;
  location: string;
  time: string;
  distance: string;
  paceGroups: string[];
  createdAt: string;
}

export interface RunGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  members: Member[];
  events: GroupEvent[];
}

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'groups.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read groups from file
async function readGroups(): Promise<RunGroup[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Write groups to file
async function writeGroups(groups: RunGroup[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(groups, null, 2));
}

// CRUD Operations
export async function createGroup(groupData: Omit<RunGroup, 'id' | 'createdAt' | 'members' | 'events'>): Promise<RunGroup> {
  const groups = await readGroups();
  
  const newGroup: RunGroup = {
    id: Date.now().toString(),
    ...groupData,
    createdAt: new Date().toISOString(),
    members: [],
    events: []
  };
  
  groups.push(newGroup);
  await writeGroups(groups);
  
  return newGroup;
}

export async function getGroups(): Promise<RunGroup[]> {
  return await readGroups();
}

export async function getGroup(id: string): Promise<RunGroup | null> {
  const groups = await readGroups();
  return groups.find(group => group.id === id) || null;
}

export async function updateGroup(id: string, updates: Partial<Omit<RunGroup, 'id' | 'createdAt'>>): Promise<RunGroup | null> {
  const groups = await readGroups();
  const groupIndex = groups.findIndex(group => group.id === id);
  
  if (groupIndex === -1) {
    return null;
  }
  
  groups[groupIndex] = {
    ...groups[groupIndex],
    ...updates
  };
  
  await writeGroups(groups);
  return groups[groupIndex];
}

export async function deleteGroup(id: string): Promise<boolean> {
  const groups = await readGroups();
  const filteredGroups = groups.filter(group => group.id !== id);
  
  if (filteredGroups.length === groups.length) {
    return false; // Group not found
  }
  
  await writeGroups(filteredGroups);
  return true;
}

export async function addMember(groupId: string, memberData: Omit<Member, 'id'>): Promise<Member | null> {
  const groups = await readGroups();
  const groupIndex = groups.findIndex(group => group.id === groupId);
  
  if (groupIndex === -1) {
    return null;
  }
  
  const newMember: Member = {
    id: Date.now().toString(),
    ...memberData
  };
  
  groups[groupIndex].members.push(newMember);
  await writeGroups(groups);
  
  return newMember;
}

export async function removeMember(groupId: string, memberId: string): Promise<boolean> {
  const groups = await readGroups();
  const groupIndex = groups.findIndex(group => group.id === groupId);
  
  if (groupIndex === -1) {
    return false;
  }
  
  const memberIndex = groups[groupIndex].members.findIndex(member => member.id === memberId);
  
  if (memberIndex === -1) {
    return false;
  }
  
  groups[groupIndex].members.splice(memberIndex, 1);
  await writeGroups(groups);
  
  return true;
}

export async function getMembers(groupId: string): Promise<Member[]> {
  const group = await getGroup(groupId);
  return group?.members || [];
}

export async function addEvent(groupId: string, eventData: Omit<GroupEvent, 'id' | 'createdAt'>): Promise<GroupEvent | null> {
  const groups = await readGroups();
  const groupIndex = groups.findIndex(group => group.id === groupId);
  
  if (groupIndex === -1) {
    return null;
  }
  
  const newEvent: GroupEvent = {
    id: Date.now().toString(),
    ...eventData,
    createdAt: new Date().toISOString()
  };
  
  groups[groupIndex].events.push(newEvent);
  await writeGroups(groups);
  
  return newEvent;
}

export async function removeEvent(groupId: string, eventId: string): Promise<boolean> {
  const groups = await readGroups();
  const groupIndex = groups.findIndex(group => group.id === groupId);
  
  if (groupIndex === -1) {
    return false;
  }
  
  const eventIndex = groups[groupIndex].events.findIndex(event => event.id === eventId);
  
  if (eventIndex === -1) {
    return false;
  }
  
  groups[groupIndex].events.splice(eventIndex, 1);
  await writeGroups(groups);
  
  return true;
}

export async function getEvents(groupId: string): Promise<GroupEvent[]> {
  const group = await getGroup(groupId);
  return group?.events || [];
} 