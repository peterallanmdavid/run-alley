import { NextRequest, NextResponse } from 'next/server';
import { updateMember, removeMember } from '@/lib/supabase-data';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id, memberId } = await params;
    const body = await request.json();
    
    const updatedMember = await updateMember(id, memberId, body);
    
    if (!updatedMember) {
      return NextResponse.json(
        { error: 'Group or member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id, memberId } = await params;
    const success = await removeMember(id, memberId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Group or member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json(
      { error: 'Failed to remove member' },
      { status: 500 }
    );
  }
} 