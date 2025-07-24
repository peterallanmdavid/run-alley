import { NextRequest, NextResponse } from 'next/server';
import { createGroup, getGroups } from '@/lib/supabase-data';

export async function GET() {
  try {
    const groups = await getGroups();
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Group name and email are required' },
        { status: 400 }
      );
    }

    const { group, tempPassword } = await createGroup({ name, description, email });
    return NextResponse.json({ group, tempPassword }, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    );
  }
} 