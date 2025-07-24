import { createClient } from '@supabase/supabase-js';

if (typeof window !== 'undefined') {
  throw new Error('Supabase client should only be used on the server!');
}

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 