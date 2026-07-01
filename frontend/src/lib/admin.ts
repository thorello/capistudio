export const ALLOWED_ADMIN_EMAILS = [
  "thiagosiqueiramorello@gmail.com",
  "morello@capistudio.com",
] as const;

export function isAllowedAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase();
  return (ALLOWED_ADMIN_EMAILS as readonly string[]).includes(normalized);
}
