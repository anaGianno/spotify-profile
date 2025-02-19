import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // allow connections from outside the container
    host: "0.0.0.0",
    port: 5173,
  },
});
