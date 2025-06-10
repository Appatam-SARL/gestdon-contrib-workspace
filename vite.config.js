import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import flowbiteReact from 'flowbite-react/plugin/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  server: {
    host: '0.0.0.0', // Pour rendre l'application accessible depuis d'autres appareils
    port: 5173, // Le port que tu veux utiliser
  },
  resolve: {
    alias: {
      '@': path.resolve(fileURLToPath(import.meta.url), '../src'),
    },
  },
});
