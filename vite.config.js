import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "89b73ae6-8c01-455c-9b45-56eb4b845773-00-26ofvvbmmb6p5.sisko.replit.dev",
    ],
  },
});
