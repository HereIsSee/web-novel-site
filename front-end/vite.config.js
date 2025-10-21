import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "htpp://localhost:5107",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
