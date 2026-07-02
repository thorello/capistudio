import type { AdminAuthorizationPolicy } from "../ports/AdminAuthorizationPolicy";

const DEFAULT_ALLOWED_EMAILS = [
  "thiagosiqueiramorello@gmail.com",
  "morello@capistudio.com",
] as const;

export class EmailAllowListAdminPolicy implements AdminAuthorizationPolicy {
  private readonly allowedEmails: readonly string[];

  constructor(allowedEmails: readonly string[] = DEFAULT_ALLOWED_EMAILS) {
    this.allowedEmails = allowedEmails;
  }

  isAllowed(email: string | undefined | null): boolean {
    if (!email) return false;
    const normalized = email.toLowerCase();
    return this.allowedEmails.some((allowed) => allowed.toLowerCase() === normalized);
  }
}
