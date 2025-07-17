import { createServerReadOnly } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  return createServerReadOnly();
};

export async function getSession() {
  const supabase = createSupabaseServerClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}
