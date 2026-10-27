import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite es solo la herramienta de desarrollo y compilación (decisión de implementación).
export default defineConfig({
  plugins: [react()],
});
