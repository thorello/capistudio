import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseClient(
  url: string,
  anonKey: string,
): SupabaseClient | null {
  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}
