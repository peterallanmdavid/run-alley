'use server'

import { addEventParticipant, addMember, removeEvent, removeMember } from './supabase-data';
import { revalidatePath } from 'next/cache';

export async function addParticipantAction(
  eventId: string,
  memberId: string,
  secretKey: string
) {
  try {
    await addEventParticipant(eventId, memberId, secretKey);
    revalidatePath('/my-events');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to add participant' };
  }
}

export async function addNewMemberAndParticipantAction(
  eventId: string,
  secretKey: string,
  groupId: string,
  memberData: { name: string; age: string; gender: string; email?: string }
) {
  try {
    // First add the new member
    const member = await addMember(groupId, memberData);
    
    if (!member) {
      return { success: false, error: 'Failed to create new member' };
    }
    
    // Then add them as a participant
    await addEventParticipant(eventId, member.id, secretKey);
    
    revalidatePath('/my-events');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to add new member as participant' };
  }
}

export async function removeEventAction(groupId: string, eventId: string) {
  try {
    await removeEvent(groupId, eventId);
    revalidatePath('/my-events');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to remove event' };
  }
}

export async function removeMemberAction(groupId: string, memberId: string) {
  try {
    await removeMember(groupId, memberId);
    revalidatePath('/my-members');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to remove member' };
  }
} 

export async function addMultipleParticipantsAction(
  eventId: string,
  memberIds: string[],
  secretKey: string
) {
  try {
    // Add all participants directly using Supabase functions
    const results = [];
    const errors = [];

    for (const memberId of memberIds) {
      try {
        const participant = await addEventParticipant(eventId, memberId, secretKey);
        if (participant) {
          results.push(participant);
        }
      } catch (error) {
        errors.push({ 
          memberId, 
          error: error instanceof Error ? error.message : 'Failed to add participant' 
        });
      }
    }

    if (results.length > 0) {
      revalidatePath('/my-events');
    }

    return {
      success: results.length > 0,
      added: results,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        total: memberIds.length,
        added: results.length,
        failed: errors.length
      }
    };
  } catch (error) {
    console.error('Error adding multiple participants:', error);
    return { 
      success: false, 
      added: [], 
      errors: [{ memberId: '', error: 'Failed to add participants' }],
      summary: { total: memberIds.length, added: 0, failed: memberIds.length }
    };
  }
} 