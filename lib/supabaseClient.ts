// Supabase client helpers for Next.js App Router (browser + server)
// Comments in French: Configurer les clients Supabase pour le navigateur et le serveur.

import { createBrowserClient } from '@supabase/ssr';
// Français: Ce fichier est désormais strictement côté navigateur pour éviter l'import de `next/headers`.

// Important: These env vars must be defined in `.env.local`
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Note: We throw early to fail fast in misconfigured environments.
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Browser client (to be used in Client Components)
// Français: Client pour le navigateur, à utiliser dans les composants client.
export function createSupabaseBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Server client (to be used in Server Components / Route Handlers)
// Français: Client pour le serveur, intégration avec le stockage des cookies Next.js.
// Français: Export dédié navigateur.


