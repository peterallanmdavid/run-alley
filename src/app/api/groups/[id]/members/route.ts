import { NextRequest, NextResponse } from 'next/server';
import { getMembers, addMember } from '@/lib/supabase-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const members = await getMembers(id);
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { name, age, gender, email } = body;

    if (!name || !age || !gender) {
      return NextResponse.json(
        { error: 'Name, age, and gender are required' },
        { status: 400 }
      );
    }

    const { id } = await params;
    const newMember = await addMember(id, { name, age, gender, email });
    
    if (!newMember) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
} 