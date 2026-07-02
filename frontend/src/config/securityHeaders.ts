type CspDirectives = {
  apiUrl: string;
  supabaseUrl: string;
  isDev: boolean;
};

export function buildContentSecurityPolicy({
  apiUrl,
  supabaseUrl,
  isDev,
}: CspDirectives): string {
  const connectSources = new Set<string>(["'self'"]);

  if (apiUrl) {
    connectSources.add(apiUrl);
  }

  if (supabaseUrl) {
    connectSources.add(supabaseUrl);
    connectSources.add(supabaseUrl.replace("https://", "wss://"));
  }

  if (isDev) {
    connectSources.add("http://localhost:8080");
    connectSources.add("ws://localhost:5173");
  }

  const scriptSources = isDev ? "'self' 'unsafe-inline'" : "'self'";
  const styleSources = "'self' 'unsafe-inline' https://fonts.googleapis.com";

  return [
    "default-src 'self'",
    `script-src ${scriptSources}`,
    `style-src ${styleSources}`,
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    `connect-src ${Array.from(connectSources).join(" ")}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
} as const;

export function buildSecurityHeaders(
  apiUrl: string,
  supabaseUrl: string,
  isDev: boolean,
): Record<string, string> {
  return {
    ...securityHeaders,
    "Content-Security-Policy": buildContentSecurityPolicy({ apiUrl, supabaseUrl, isDev }),
  };
}
