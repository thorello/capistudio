import { sanitizeText } from "../utils/sanitize";

export type ContactSubmissionRecord = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export class ContactSubmission {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly createdAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    message: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.message = message;
    this.createdAt = createdAt;
  }

  static fromRecord(record: ContactSubmissionRecord): ContactSubmission {
    return new ContactSubmission(
      record.id,
      sanitizeText(record.name),
      sanitizeText(record.email),
      sanitizeText(record.message),
      new Date(record.created_at),
    );
  }

  get isLongMessage(): boolean {
    return this.message.length > 200;
  }

  formatCreatedAt(locale = "pt-BR"): string {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(this.createdAt);
  }

  get createdAtIso(): string {
    return this.createdAt.toISOString();
  }
}
