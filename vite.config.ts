import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2015",
    rollupOptions: {
      output: {
        manualChunks: {
          "vue-vendor": ["vue", "vue-router", "pinia"],
          "supabase-vendor": ["@supabase/supabase-js"],
        },
      },
    },
    sourcemap: false, // Disable source maps for production
    minify: true, // Use default esbuild minifier
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
});
