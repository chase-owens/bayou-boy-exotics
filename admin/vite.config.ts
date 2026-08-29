import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/data": {
        target: "https://admin.bayouboyexotics.com",
        changeOrigin: true,
        secure: true,
      },

      "/images": {
        target: "https://admin.bayouboyexotics.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
