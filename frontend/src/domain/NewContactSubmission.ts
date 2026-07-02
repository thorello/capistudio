import { sanitizeText } from "../utils/sanitize";

export class NewContactSubmission {
  readonly name: string;
  readonly email: string;
  readonly message: string;

  constructor(name: string, email: string, message: string) {
    this.name = name;
    this.email = email;
    this.message = message;
  }

  static create(data: { name: string; email: string; message: string }): NewContactSubmission {
    return new NewContactSubmission(
      sanitizeText(data.name),
      sanitizeText(data.email),
      sanitizeText(data.message),
    );
  }

  toJSON(): { name: string; email: string; message: string } {
    return {
      name: this.name,
      email: this.email,
      message: this.message,
    };
  }
}
