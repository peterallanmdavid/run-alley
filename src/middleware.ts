import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function isPrivateRoute(path: string) {
  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    path === '/profile' ||
    path.startsWith('/profile/')
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isPrivateRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('session-token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let payload: { id: string; email: string; role: string; name: string };
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload: jwtPayload } = await jwtVerify(token, secret);
    payload = jwtPayload as { id: string; email: string; role: string; name: string };
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check if session exists in DB
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('*')
    .eq('token', token)
    .single();
  if (sessionError || !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based redirect for /profile
  if (
    (pathname === '/profile' || pathname.startsWith('/profile/')) &&
    payload.role !== 'GroupOwner'
  ) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }else if(
    (pathname === '/admin' || pathname.startsWith('/admin/')) &&
    payload.role !== 'Admin'
  ) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/profile',
    '/profile/:path*',
  ],
}; 