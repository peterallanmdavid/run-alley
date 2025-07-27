export interface Member {
  id: string;
  name: string;
  age: string;
  gender: string;
  email?: string; // Optional email field
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
  email: string;
  description: string;
  createdAt: string;
  members: Member[];
  events: GroupEvent[];
  firstLogin: boolean;
  role: 'Admin' | 'GroupOwner';
}

// In-memory storage for production compatibility
let groupsData: RunGroup[] = [];

// Initialize with sample data in development
async function initializeData() {
  if (process.env.NODE_ENV === 'development') {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const dataPath = path.default.join(process.cwd(), 'data', 'groups.json');
      if (fs.default.existsSync(dataPath)) {
        const data = fs.default.readFileSync(dataPath, 'utf-8');
        groupsData = JSON.parse(data);
      }
    } catch (error) {
      console.log('No existing data file found, starting with empty data');
    }
  }
}

// Initialize data
initializeData();

// Read groups from memory
async function readGroups(): Promise<RunGroup[]> {
  return groupsData;
}

// Write groups to memory
async function writeGroups(groups: RunGroup[]): Promise<void> {
  groupsData = groups;
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

export async function getAllEvents(): Promise<Array<GroupEvent & { groupName: string; groupId: string }>> {
  const groups = await readGroups();
  const allEvents: Array<GroupEvent & { groupName: string; groupId: string }> = [];
  
  groups.forEach(group => {
    group.events.forEach(event => {
      allEvents.push({
        ...event,
        groupName: group.name,
        groupId: group.id
      });
    });
  });
  
  // Sort by event time (earliest first)
  return allEvents.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
} 