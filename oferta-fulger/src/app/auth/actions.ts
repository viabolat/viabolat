'use server';

import { redirect } from 'next/navigation';
import { createServer } from '@/utils/supabase/server';

export async function signOut() {
  const supabase = createServer();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error logging out:', error.message);
  }

  redirect('/login');
}
