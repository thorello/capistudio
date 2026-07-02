export interface AdminAuthorizationPolicy {
  isAllowed(email: string | undefined | null): boolean;
}
