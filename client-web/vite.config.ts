import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // Ensures assets are loaded correctly on GitHub Pages
  server: {
    fs: {
      strict: false,
      allow: [".."],
    },
  },
  resolve: {
    alias: {
      "@config": path.resolve(__dirname, "../src/config"),
    },
  },
});
