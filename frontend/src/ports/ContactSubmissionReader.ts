import type { ContactSubmission } from "../domain/ContactSubmission";

export interface ContactSubmissionReader {
  findAll(): Promise<ContactSubmission[]>;
}
