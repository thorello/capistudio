import type { NewContactSubmission } from "../domain/NewContactSubmission";

export interface ContactSubmissionWriter {
  submit(submission: NewContactSubmission): Promise<void>;
}
