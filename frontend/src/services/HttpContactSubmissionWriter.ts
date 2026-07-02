import type { NewContactSubmission } from "../domain/NewContactSubmission";
import type { ContactSubmissionWriter } from "../ports/ContactSubmissionWriter";
import { isValidEmail } from "../utils/sanitize";

export class HttpContactSubmissionWriter implements ContactSubmissionWriter {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async submit(submission: NewContactSubmission): Promise<void> {
    if (!isValidEmail(submission.email)) {
      throw new Error("E-mail inválido.");
    }

    const response = await fetch(`${this.baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission.toJSON()),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message ?? "Erro ao enviar mensagem");
      }

      throw new Error("Erro ao enviar mensagem");
    }
  }
}
