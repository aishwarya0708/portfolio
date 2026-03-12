import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Needed for Vercel routing — any URL path loads the app
  // and theme engine reads window.location.pathname
  build: {
    outDir: "dist",
  },
});
