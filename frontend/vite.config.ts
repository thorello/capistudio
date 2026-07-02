import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { buildSecurityHeaders } from "./src/config/securityHeaders.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_API_URL || "http://localhost:8080";
  const supabaseUrl = env.VITE_SUPABASE_URL || "";
  const isDev = mode === "development";

  return {
    plugins: [react()],
    server: {
      headers: buildSecurityHeaders(apiUrl, supabaseUrl, isDev),
    },
    preview: {
      headers: buildSecurityHeaders(apiUrl, supabaseUrl, false),
    },
  };
});
