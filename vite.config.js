import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['offline.html', 'icons/*.png', 'hero-bg.jpg'],
      manifest: false, // manifest.json sudah manual di public/
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\.(js|css|woff2|woff)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'app-shell-v1' }
          },
          {
            urlPattern: /\/api\/(produk|news|umkm)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-data-v1',
              networkTimeoutSeconds: 5
            }
          },
          {
            urlPattern: /res\.cloudinary\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-v1',
              expiration: { maxEntries: 80, maxAgeSeconds: 7 * 24 * 60 * 60 }
            }
          }
        ],
        additionalManifestEntries: [{ url: '/offline.html', revision: null }],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/offline\.html/, /^\/api\//]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
