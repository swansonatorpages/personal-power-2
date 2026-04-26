import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Set this to your GitHub Pages repo sub-path if deploying to a sub-directory.
// For example, if your repo is "username/personal-power-2" it becomes '/personal-power-2/'
// If deploying to a custom domain or root, use '/'
const BASE_PATH = process.env.VITE_BASE_PATH ?? './';

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Use 'generateSW' (default) — VitePWA generates the SW from the manifest config
      devOptions: { enabled: false },
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'icons/icon-192-v1.png',
        'icons/icon-512-v1.png',
      ],
      manifest: {
        name: 'Personal Power II Journal',
        short_name: 'PP2 Journal',
        description: 'Complete your 30-day Personal Power II program — offline-first, local data only.',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        start_url: './',
        scope: './',
        orientation: 'portrait-primary',
        categories: ['productivity', 'lifestyle'],
        icons: [
          {
            src: 'icons/icon-192-v1.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'icons/icon-512-v1.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Cache name prefix — bump version to invalidate on next deploy
        cacheId: 'pp2-v2',
        // Stale-while-revalidate for navigation (SPA fallback)
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/\/api\//],
        // Cache JS/CSS/HTML aggressively — they're versioned by Vite hashes
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pp2-google-fonts-v1',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pp2-gstatic-fonts-v1',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        // Clean up old caches on activate
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
});
