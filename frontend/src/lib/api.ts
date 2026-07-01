import { apiUrl, supabase } from "../lib/supabase";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function submitContact(data: ContactFormData): Promise<void> {
  const response = await fetch(`${apiUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? "Erro ao enviar mensagem");
  }
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  if (!supabase) throw new Error("Supabase não configurado.");

  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, name, email, message, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ContactSubmission[];
}
