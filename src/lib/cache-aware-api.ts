import { 
  clearMembersCache, 
  clearEventsCache, 
  clearEventCache, 
  clearGroupsCache,
  clearGroupCache 
} from './performance';
import { 
  addMember, 
  updateMember, 
  removeMember,
  addEvent,
  updateEvent,
  removeEvent,
  addEventParticipant,
  removeEventParticipant,
  addEventParticipants
} from './api';

// Cache-aware member operations
export async function addMemberWithCache(groupId: string, data: { name: string; age: string; gender: string; email?: string }) {
  const result = await addMember(groupId, data);
  clearMembersCache(groupId);
  return result;
}

export async function updateMemberWithCache(groupId: string, memberId: string, data: { name?: string; age?: string; gender?: string; email?: string }) {
  const result = await updateMember(groupId, memberId, data);
  clearMembersCache(groupId);
  return result;
}

export async function removeMemberWithCache(groupId: string, memberId: string) {
  const result = await removeMember(groupId, memberId);
  clearMembersCache(groupId);
  return result;
}

// Cache-aware event operations
export async function addEventWithCache(groupId: string, data: { name: string; location: string; time: string; distance: string; paceGroups: string[] }) {
  const result = await addEvent(groupId, data);
  clearEventsCache(groupId);
  return result;
}

export async function updateEventWithCache(groupId: string, eventId: string, data: { name?: string; location?: string; time?: string; distance?: string; paceGroups?: string[] }) {
  const result = await updateEvent(groupId, eventId, data);
  clearEventsCache(groupId);
  clearEventCache(eventId);
  return result;
}

export async function removeEventWithCache(groupId: string, eventId: string) {
  const result = await removeEvent(groupId, eventId);
  clearEventsCache(groupId);
  clearEventCache(eventId);
  return result;
}

// Cache-aware participant operations
export async function addEventParticipantWithCache(eventId: string, memberId: string, secretKey: string) {
  const result = await addEventParticipant(eventId, memberId, secretKey);
  clearEventCache(eventId);
  return result;
}

export async function removeEventParticipantWithCache(eventId: string, participantId: string) {
  const result = await removeEventParticipant(eventId, participantId);
  clearEventCache(eventId);
  return result;
}

export async function addEventParticipantsWithCache(eventId: string, memberIds: string[], secretKey: string) {
  const result = await addEventParticipants(eventId, memberIds, secretKey);
  clearEventCache(eventId);
  return result;
} 