import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { qrcode } from "vite-plugin-qrcode";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), qrcode()],
  server: {
    port: 8800,
  },
  resolve: {
    alias: {
      "@bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "import",
          "mixed-decls",
          "color-functions",
          "global-builtin",
        ],
      },
    },
  },
});
