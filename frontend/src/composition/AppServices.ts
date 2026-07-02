import type { AdminAuthorizationPolicy } from "../ports/AdminAuthorizationPolicy";
import type { AuthService } from "../ports/AuthService";
import type { ContactSubmissionReader } from "../ports/ContactSubmissionReader";
import type { ContactSubmissionWriter } from "../ports/ContactSubmissionWriter";

export interface AppServices {
  contactWriter: ContactSubmissionWriter;
  contactReader: ContactSubmissionReader | null;
  authService: AuthService;
  adminPolicy: AdminAuthorizationPolicy;
}
