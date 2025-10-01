import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import flowbiteReact from 'flowbite-react/plugin/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    flowbiteReact(),
    VitePWA({
      registerType: 'autoUpdate',

      // 🧠 Infos du manifeste PWA
      manifest: {
        name: 'Contrib',
        short_name: 'Contrib',
        description: 'Plateforme SaaS de gestion des activités contributeurs',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      // 📦 Options de mise en cache Workbox
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 Mo
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // fichiers à précacher
      },

      // 📱 (Optionnel) Inclure les fichiers statiques à copier dans dist/
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'android-icon-192x192.png', 'android-icon-144x144.png', 'android-icon-120x120.png'],
    }),
  ],

  server: {
    host: '0.0.0.0', // pour l'accès depuis le réseau local
    port: 5173,
  },

  resolve: {
    alias: {
      '@': path.resolve(fileURLToPath(import.meta.url), '../src'),
    },
  },
});

