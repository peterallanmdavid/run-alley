export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, oldPassword, newPassword, repeatPassword } = await request.json();
    if (!email || !oldPassword || !newPassword || !repeatPassword) {
      return NextResponse.json({ error: 'Email, old password, new password, and repeat password are required' }, { status: 400 });
    }

    if (newPassword !== repeatPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
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

    // Check old password
    const valid = await bcrypt.compare(oldPassword, data.password);
    
    if (!valid) {
      return NextResponse.json({ error: 'Invalid old password' }, { status: 401 });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password and set firstLogin to false
    const { error: updateError } = await supabase
      .from('groups')
      .update({ password: hashed, first_login: false })
      .eq('email', email);
    if (updateError) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Password change failed' }, { status: 500 });
  }
} 