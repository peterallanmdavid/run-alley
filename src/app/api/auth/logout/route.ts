export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get token from HTTP-only cookie
    const token = request.cookies.get('session-token')?.value;
    if (!token) {
      return NextResponse.json({ success: true });
    }

    // Delete the session from the DB
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('token', token);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
    }

    // Clear the session-token cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
} 