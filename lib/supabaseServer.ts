// Supabase server client for Next.js App Router
// Français: Client Supabase pour le serveur. Peut utiliser `next/headers` en toute sécurité.

import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

export async function createSupabaseServerClient() {
  try {
    const cookieStore = await cookies();

    // Validate environment variables
    if (!SUPABASE_URL || SUPABASE_URL === 'https://placeholder.supabase.co' || 
        !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'placeholder_key') {
      throw new Error('Supabase environment variables are not configured');
    }

    return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Ignore cookie setting errors in middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 });
          } catch {
            // Ignore cookie removal errors in middleware
          }
        },
      },
    });
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw error;
  }
}


