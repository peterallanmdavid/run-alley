import { RunGroup, Member, GroupEvent } from './data';

const API_BASE = '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, error.error || 'Request failed');
  }
  return response.json();
}

// Group operations
export async function createGroup(data: { name: string; description: string }): Promise<RunGroup> {
  const response = await fetch(`${API_BASE}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<RunGroup>(response);
}

export async function getGroups(): Promise<RunGroup[]> {
  const response = await fetch(`${API_BASE}/groups`);
  return handleResponse<RunGroup[]>(response);
}

export async function getGroup(id: string): Promise<RunGroup> {
  const response = await fetch(`${API_BASE}/groups/${id}`);
  return handleResponse<RunGroup>(response);
}

export async function updateGroup(id: string, data: { name: string; description: string }): Promise<RunGroup> {
  const response = await fetch(`${API_BASE}/groups/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<RunGroup>(response);
}

export async function deleteGroup(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/groups/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response);
}

// Member operations
export async function getMembers(groupId: string): Promise<Member[]> {
  const response = await fetch(`${API_BASE}/groups/${groupId}/members`);
  return handleResponse<Member[]>(response);
}

export async function addMember(groupId: string, data: { name: string; age: string; gender: string }): Promise<Member> {
  const response = await fetch(`${API_BASE}/groups/${groupId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Member>(response);
}

export async function removeMember(groupId: string, memberId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/groups/${groupId}/members/${memberId}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response);
}

// Event operations
export async function getEvents(groupId: string): Promise<GroupEvent[]> {
  const response = await fetch(`${API_BASE}/groups/${groupId}/events`);
  return handleResponse<GroupEvent[]>(response);
}

export async function addEvent(groupId: string, data: { name: string; location: string; time: string; distance: string; paceGroups: string[] }): Promise<GroupEvent> {
  const response = await fetch(`${API_BASE}/groups/${groupId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<GroupEvent>(response);
}

export async function removeEvent(groupId: string, eventId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/groups/${groupId}/events/${eventId}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response);
}

export async function getAllEvents(): Promise<Array<GroupEvent & { groupName: string; groupId: string }>> {
  const response = await fetch(`${API_BASE}/events`);
  return handleResponse<Array<GroupEvent & { groupName: string; groupId: string }>>(response);
} 