export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Fetch group by email
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check password
    const valid = await bcrypt.compare(password, data.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create JWT token using jose
    const secret = new TextEncoder().encode(JWT_SECRET);
    const payload = {
      id: data.id,
      email: data.email,
      role: data.role || 'GroupOwner',
      name: data.name
    };
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    // Insert session into sessions table
    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        group_id: data.id,
        token,
        created_at: new Date().toISOString(),
      });
    if (sessionError) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    // Set session-token as HTTP-only cookie
    const response = NextResponse.json({
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
    response.cookies.set('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
} 