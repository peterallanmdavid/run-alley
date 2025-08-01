
import { RunGroup, Member, GroupEvent, EventParticipant } from './data';

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

// Client-side API functions
export async function createGroup(data: { name: string; description: string; email: string }): Promise<{ group: RunGroup; tempPassword: string }> {
  const response = await fetch(`${API_BASE}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<{ group: RunGroup; tempPassword: string }>(response);
}

export async function getGroups(): Promise<RunGroup[]> {
  const response = await fetch(`${API_BASE}/groups`, {
    cache: 'no-store'
  });
  return handleResponse<RunGroup[]>(response);
}

export async function getGroup(id: string): Promise<RunGroup> {
  const response = await fetch(`${API_BASE}/groups/${id}`, {
    cache: 'no-store'
  });
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
  const response = await fetch(`${API_BASE}/groups/${groupId}/members`, {
    cache: 'no-store'
  });
  return handleResponse<Member[]>(response);
}

export async function addMember(groupId: string, data: { name: string; age: string; gender: string; email?: string }): Promise<Member> {
  const response = await fetch(`${API_BASE}/groups/${groupId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Member>(response);
}

export async function updateMember(groupId: string, memberId: string, data: { name?: string; age?: string; gender?: string; email?: string }): Promise<Member> {
  const response = await fetch(`${API_BASE}/groups/${groupId}/members/${memberId}`, {
    method: 'PUT',
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
  const response = await fetch(`${API_BASE}/groups/${groupId}/events`, {
    cache: 'no-store'
  });
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

export async function updateEvent(groupId: string, eventId: string, data: { name?: string; location?: string; time?: string; distance?: string; paceGroups?: string[] }): Promise<GroupEvent> {
  const response = await fetch(`${API_BASE}/groups/${groupId}/events/${eventId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<GroupEvent>(response);
}

export async function addEventParticipant(eventId: string, memberId: string, secretKey: string): Promise<EventParticipant> {
  const response = await fetch(`${API_BASE}/events/${eventId}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId, secretKey }),
  });
  return handleResponse<EventParticipant>(response);
}

export async function getEventParticipants(eventId: string): Promise<EventParticipant[]> {
  const response = await fetch(`${API_BASE}/events/${eventId}/participants`, {
    cache: 'no-store'
  });
  return handleResponse<EventParticipant[]>(response);
}

export async function getAllEvents(): Promise<Array<GroupEvent & { groupName: string; groupId: string }>> {
  const response = await fetch(`${API_BASE}/events`, {
    cache: 'no-store'
  });
  return handleResponse<Array<GroupEvent & { groupName: string; groupId: string }>>(response);
} 

export async function login(email: string, password: string): Promise<{ group: RunGroup & { email: string; role: 'Admin' | 'GroupOwner' } }> {
  const response = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(response.status, data.error || 'Login failed');
  }
  return response.json();
}

export async function changePassword(email: string, oldPassword: string, newPassword: string, repeatPassword: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, oldPassword, newPassword, repeatPassword }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(response.status, data.error || 'Password change failed');
  }
  return response.json();
}

export async function logout(): Promise<{ success: boolean }> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(response.status, data.error || 'Logout failed');
  }
  return response.json();
}

export async function getCurrentUser(): Promise<{ group: RunGroup & { email: string; role: 'Admin' | 'GroupOwner' } } | null> {
  const response = await fetch('/api/auth/me', {
    cache: 'no-store'
  });
  if (!response.ok) return null;
  return response.json();
}

// Admin operations
export async function resetPassword(groupId: string): Promise<{ success: boolean; newPassword: string; message: string }> {
  const response = await fetch(`${API_BASE}/groups/${groupId}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<{ success: boolean; newPassword: string; message: string }>(response);
}

export async function addEventParticipants(eventId: string, memberIds: string[], secretKey: string): Promise<{ success: boolean; added: EventParticipant[]; errors?: Array<{ memberId: string; error: string }>; summary: { total: number; added: number; failed: number } }> {
  const response = await fetch(`${API_BASE}/events/${eventId}/participants/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberIds, secretKey }),
  });
  return handleResponse(response);
}

export async function removeEventParticipant(eventId: string, participantId: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/events/${eventId}/participants/${participantId}`, {
    method: 'DELETE',
  });
  return handleResponse<{ message: string }>(response);
}

export async function getEventById(eventId: string): Promise<GroupEvent & { groupName: string; groupId: string }> {
  const response = await fetch(`${API_BASE}/events/${eventId}`);
  return handleResponse<GroupEvent & { groupName: string; groupId: string }>(response);
}


export async function getEventBySecretCode(secretCode: string): Promise<GroupEvent & { groupName: string; groupId: string }> {
  const response = await fetch(`${API_BASE}/events/secret-code/${secretCode}`);
  return handleResponse<GroupEvent & { groupName: string; groupId: string }>(response);
}

export async function joinEvent(
  secretCode: string, 
  memberData?: { name: string; age: string; gender: string; email?: string },
  memberId?: string
): Promise<{ success: boolean; message: string }> {
  const body: { secretCode: string; memberData?: { name: string; age: string; gender: string; email?: string }; memberId?: string } = { secretCode };
  if (memberData) body.memberData = memberData;
  if (memberId) body.memberId = memberId;

  console.log('Joining event:', body);
  const response = await fetch(`${API_BASE}/join-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<{ success: boolean; message: string }>(response);
}

export async function joinEventWithMember(secretCode: string, memberId: string): Promise<{ success: boolean; message: string }> {
  return joinEvent(secretCode, undefined, memberId);
}

export async function getMembersBySecretCode(secretCode: string): Promise<Array<{ id: string; name: string; age: string; gender: string; email?: string }>> {
  const response = await fetch(`${API_BASE}/events/secret-code/${secretCode}/members`);
  return handleResponse<Array<{ id: string; name: string; age: string; gender: string; email?: string }>>(response);
}