import { NextRequest, NextResponse } from 'next/server';
import { removeMember } from '@/lib/data';

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