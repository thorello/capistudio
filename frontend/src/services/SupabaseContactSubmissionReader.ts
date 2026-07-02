import type { SupabaseClient } from "@supabase/supabase-js";
import { ContactSubmission } from "../domain/ContactSubmission";
import type { ContactSubmissionReader } from "../ports/ContactSubmissionReader";

export class SupabaseContactSubmissionReader implements ContactSubmissionReader {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async findAll(): Promise<ContactSubmission[]> {
    const { data, error } = await this.client
      .from("contact_submissions")
      .select("id, name, email, message, created_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map(ContactSubmission.fromRecord);
  }
}
