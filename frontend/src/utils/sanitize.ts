const HTML_TAG_PATTERN = /<[^>]*>/g;
const CONTROL_CHARS_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

export function sanitizeText(value: string): string {
  return value
    .replace(CONTROL_CHARS_PATTERN, "")
    .replace(HTML_TAG_PATTERN, "")
    .trim();
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value) && !value.includes("<") && !value.includes(">");
}
