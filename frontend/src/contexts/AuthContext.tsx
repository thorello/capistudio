import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useServices } from "../composition/ServicesContext";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { authService } = useServices();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    authService
      .getSession()
      .then((current) => {
        if (mounted) setSession(current);
      })
      .catch(() => {
        if (mounted) setSession(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const unsubscribe = authService.onAuthStateChange((nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [authService]);

  const signInWithGoogle = useCallback(async () => {
    await authService.signInWithGoogle(`${window.location.origin}/admin`);
  }, [authService]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const validSession = await authService.signInWithEmail(email, password);
      setSession(validSession);
    },
    [authService],
  );

  const signOut = useCallback(async () => {
    await authService.signOut();
    setSession(null);
  }, [authService]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signOut,
    }),
    [session, loading, signInWithGoogle, signInWithEmail, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }
  return context;
}
