import { getGroup } from '@/lib/supabase-data';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import ManageGroupClient from './ManageGroupClient';
import { RunGroup } from '@/lib/data';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function getCurrentUserServer(): Promise<{ id: string; email: string; role: string; name: string } | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('session-token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; email: string; role: string; name: string };
  } catch {
    return null;
  }
}

export default async function ManageGroupPage() {
  const currentUser = await getCurrentUserServer();
  if (!currentUser) {
    // Optionally, redirect to login or show an error
    return <div className="text-center py-8">Not authenticated.</div>;
  }
  const group = await getGroup(currentUser.id);
  if (!group) {
    return <div className="text-center py-8">Group not found.</div>;
  }
  return <ManageGroupClient group={group} currentUser={currentUser} />;
} 