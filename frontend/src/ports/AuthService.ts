import type { Session } from "@supabase/supabase-js";

export interface AuthService {
  getSession(): Promise<Session | null>;
  onAuthStateChange(listener: (session: Session | null) => void): () => void;
  signInWithGoogle(redirectTo: string): Promise<void>;
  signInWithEmail(email: string, password: string): Promise<Session>;
  signOut(): Promise<void>;
}
