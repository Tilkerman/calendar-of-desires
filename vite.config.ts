import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const base = isProduction ? '/calendar-of-desires/' : '/';
  
  return {
    base,
    server: {
      host: 'localhost',
      port: 5173
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'apple-touch-icon.png',
          'favicon-16.png',
          'favicon-32.png',
          'icon-192.png',
          'icon-512.png'
        ],
        manifest: {
          name: 'LUMI',
          short_name: 'LUMI',
          description: 'LUMI — ежедневный ритуал работы с желаниями',
          theme_color: '#58C8C7',
          background_color: '#58C8C7',
          display: 'standalone',
          orientation: 'portrait',
          scope: isProduction ? '/calendar-of-desires/' : '/',
          start_url: isProduction ? '/calendar-of-desires/' : '/',
        icons: [
          {
            // Важно для GitHub Pages: в проде иконка должна быть внутри base path
            src: isProduction ? '/calendar-of-desires/icon-192.png' : '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: isProduction ? '/calendar-of-desires/icon-512.png' : '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            // iOS touch icon
            src: isProduction ? '/calendar-of-desires/apple-touch-icon.png' : '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // быстрее подхватываем обновления на PWA (особенно на iOS)
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          // IMPORTANT for GitHub Pages: avoid serving a stale cached HTML after deploy.
          // This is the typical cause of "white screen" (HTML points to old hashed assets).
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 // 1 hour
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
  };
});
