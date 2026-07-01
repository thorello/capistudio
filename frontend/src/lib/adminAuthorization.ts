import type { Session } from "@supabase/supabase-js";
import { isAllowedAdminEmail } from "./admin";
import { supabase } from "./supabase";

export async function validateAdminSession(session: Session | null): Promise<Session | null> {
  if (!session) return null;

  const email = session.user.email;
  if (!isAllowedAdminEmail(email)) {
    if (supabase) {
      await supabase.auth.signOut();
    }
    throw new Error("Acesso restrito a administradores autorizados.");
  }

  return session;
}
