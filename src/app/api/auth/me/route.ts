export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    // Get token from HTTP-only cookie
    const token = request.cookies.get('session-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No authentication token' }, { status: 401 });
    }

    // Verify JWT token using jose
    let decoded;
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      decoded = payload as {
        id: string;
        email: string;
        role: 'Admin' | 'GroupOwner';
        name: string;
      };
    } catch (err) {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    // Check if session exists in DB
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('token', token)
      .single();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found or expired' }, { status: 401 });
    }

    // Fetch current user data from database
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      group: {
        id: data.id,
        name: data.name,
        email: data.email,
        description: data.description,
        createdAt: data.created_at,
        firstLogin: data.first_login,
        role: data.role || 'GroupOwner',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 