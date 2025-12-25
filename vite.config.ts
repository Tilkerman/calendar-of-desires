import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const base = isProduction ? '/calendar-of-desires/' : '/';
  
  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.svg', 'vite.svg'],
        manifest: {
          name: 'Calendar of Desires',
          short_name: 'CoD',
          description: 'Календарь желаний - ежедневный ритуал работы с желаниями',
          theme_color: '#646cff',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: isProduction ? '/calendar-of-desires/' : '/',
          start_url: isProduction ? '/calendar-of-desires/' : '/',
        icons: [
          {
            // Важно для GitHub Pages: в проде иконка должна быть внутри base path
            src: isProduction ? '/calendar-of-desires/apple-touch-icon.svg' : '/apple-touch-icon.svg',
            sizes: '180x180',
            type: 'image/svg+xml',
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
