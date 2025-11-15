// Supabase client for Next.js Middleware
// Français: Client Supabase pour le middleware Next.js

import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import type { CookieOptions } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

export function createSupabaseMiddlewareClient(request: NextRequest, response: NextResponse) {
  // Validate environment variables
  if (!SUPABASE_URL || SUPABASE_URL === 'https://placeholder.supabase.co' || 
      !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'placeholder_key') {
    throw new Error('Supabase environment variables are not configured');
  }

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        } catch {
          // Ignore cookie setting errors in middleware
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          request.cookies.set(name, '');
          response.cookies.set(name, '', { ...options, maxAge: 0 });
        } catch {
          // Ignore cookie removal errors in middleware
        }
      },
    },
  });
}

