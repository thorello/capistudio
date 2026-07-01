import { supabase } from "./supabase";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface ContactSubmissionReader {
  findAll(): Promise<ContactSubmission[]>;
}

class SupabaseContactSubmissionReader implements ContactSubmissionReader {
  async findAll(): Promise<ContactSubmission[]> {
    if (!supabase) throw new Error("Supabase não configurado.");

    const { data, error } = await supabase
      .from("contact_submissions")
      .select("id, name, email, message, created_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as ContactSubmission[];
  }
}

export const contactSubmissionReader: ContactSubmissionReader =
  new SupabaseContactSubmissionReader();

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  return contactSubmissionReader.findAll();
}
