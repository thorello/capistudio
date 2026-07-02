import { appConfig } from "../config/appConfig";
import type { AppServices } from "./AppServices";
import { EmailAllowListAdminPolicy } from "../services/EmailAllowListAdminPolicy";
import { HttpContactSubmissionWriter } from "../services/HttpContactSubmissionWriter";
import { SupabaseAuthService } from "../services/SupabaseAuthService";
import { SupabaseContactSubmissionReader } from "../services/SupabaseContactSubmissionReader";
import { createSupabaseClient } from "../infrastructure/supabaseClient";

export function createAppServices(): AppServices {
  const adminPolicy = new EmailAllowListAdminPolicy();
  const supabase = createSupabaseClient(
    appConfig.supabaseUrl,
    appConfig.supabaseAnonKey,
  );

  return {
    adminPolicy,
    contactWriter: new HttpContactSubmissionWriter(appConfig.apiUrl),
    contactReader: supabase ? new SupabaseContactSubmissionReader(supabase) : null,
    authService: new SupabaseAuthService(supabase, adminPolicy),
  };
}
