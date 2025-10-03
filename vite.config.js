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
      injectRegister: 'auto', // injecte automatiquement le service worker
    
      pwaAssets: {
        preset: 'minimal', // utilise un preset standard
        image: 'public/favicon-96x96.png', // ton image source
      },
    
      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
      },
    
      manifest: {
        name: 'Contrib',
        short_name: 'Contrib',
        description: 'Plateforme SaaS de gestion des activités contributeurs',
        theme_color: '#6c2bd9',
        background_color: '#ffffff',
        display: 'standalone',       // ✅ Important pour installation
        orientation: 'portrait',     // ✅ Pour mobile
        scope: '/',                  // ✅ Nécessaire pour l’installation
        start_url: '/',              // ✅ Point d’entrée après installation
        id: '/',                     // ✅ Unique ID de l’app
        display_override: ["window-controls-overlay"],
        lang: 'fr',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
        'android-icon-192x192.png',
        'android-icon-144x144.png',
        'android-icon-120x120.png'
      ],
    })
    
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

