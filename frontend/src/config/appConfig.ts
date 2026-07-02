export const CONTACT_EMAIL = "morello@capistudio.com";

export const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
} as const;
