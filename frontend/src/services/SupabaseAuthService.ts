import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { AdminAuthorizationPolicy } from "../ports/AdminAuthorizationPolicy";
import type { AuthService } from "../ports/AuthService";

export class SupabaseAuthService implements AuthService {
  private readonly client: SupabaseClient | null;
  private readonly adminPolicy: AdminAuthorizationPolicy;

  constructor(client: SupabaseClient | null, adminPolicy: AdminAuthorizationPolicy) {
    this.client = client;
    this.adminPolicy = adminPolicy;
  }

  async getSession(): Promise<Session | null> {
    this.ensureConfigured();

    const user = await this.fetchVerifiedUser();
    if (!user) {
      return null;
    }

    const { data } = await this.client!.auth.getSession();
    return this.validateVerifiedUser(user, data.session);
  }

  onAuthStateChange(listener: (session: Session | null) => void): () => void {
    if (!this.client) {
      listener(null);
      return () => {};
    }

    const {
      data: { subscription },
    } = this.client.auth.onAuthStateChange(async (_event, session) => {
      try {
        listener(await this.validateSession(session));
      } catch {
        listener(null);
      }
    });

    return () => subscription.unsubscribe();
  }

  async signInWithGoogle(redirectTo: string): Promise<void> {
    this.ensureConfigured();

    const { error } = await this.client!.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) throw error;
  }

  async signInWithEmail(email: string, password: string): Promise<Session> {
    this.ensureConfigured();

    if (!this.adminPolicy.isAllowed(email)) {
      throw new Error("Este e-mail não tem permissão de administrador.");
    }

    const { data, error } = await this.client!.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw error;

    const user = await this.fetchVerifiedUser();
    const session = await this.validateVerifiedUser(user, data.session);
    if (!session) {
      throw new Error("Sessão inválida após login.");
    }

    return session;
  }

  async signOut(): Promise<void> {
    if (!this.client) return;
    await this.client.auth.signOut();
  }

  private ensureConfigured(): void {
    if (!this.client) {
      throw new Error("Supabase não configurado.");
    }
  }

  private async fetchVerifiedUser(): Promise<User | null> {
    const { data, error } = await this.client!.auth.getUser();
    if (error || !data.user) {
      return null;
    }
    return data.user;
  }

  private async validateSession(session: Session | null): Promise<Session | null> {
    if (!session) return null;

    const user = await this.fetchVerifiedUser();
    return this.validateVerifiedUser(user, session);
  }

  private async validateVerifiedUser(
    user: User | null,
    session: Session | null,
  ): Promise<Session | null> {
    if (!user || !session) {
      return null;
    }

    if (user.id !== session.user.id) {
      await this.client?.auth.signOut();
      throw new Error("Sessão inconsistente. Faça login novamente.");
    }

    if (this.isExpired(session)) {
      await this.client?.auth.signOut();
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    if (!this.adminPolicy.isAllowed(user.email)) {
      await this.client?.auth.signOut();
      throw new Error("Acesso restrito a administradores autorizados.");
    }

    return session;
  }

  private isExpired(session: Session): boolean {
    if (!session.expires_at) {
      return false;
    }

    const expiresAtMs = session.expires_at * 1000;
    return Date.now() >= expiresAtMs;
  }
}
