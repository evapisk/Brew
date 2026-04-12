import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Server-side client using the service role key.
 * Bypasses RLS — use only in API routes for cross-user reads (e.g. matching).
 * Never expose this to the browser.
 */
export function createServerClient() {
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey);
}

/**
 * Browser-safe client using the anon key.
 * RLS applies — use in Client Components.
 */
export function createBrowserClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
