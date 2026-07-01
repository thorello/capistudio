import { apiUrl } from "./supabase";

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
