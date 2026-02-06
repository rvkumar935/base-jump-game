// Service Worker for PWA and offline support

const CACHE_NAME = 'base-jump-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/leaderboard.html',
  '/style.css',
  '/config.js',
  '/game.js',
  '/wallet.js',
  '/xp-system.js',
  '/anti-bot.js',
  '/leaderboard.js',
  'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.js',
  'https://cdn.jsdelivr.net/npm/ethers@6/dist/ethers.umd.js'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(() => {
        console.log('Some assets failed to cache, continuing...');
      });
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // Skip requests with unsupported schemes (chrome-extension, etc)
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;

      return fetch(event.request).then(fetchResponse => {
        // Only cache successful responses
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type === 'error') {
          return fetchResponse;
        }

        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache).catch(err => {
            // Silently fail - some URLs can't be cached
          });
        });

        return fetchResponse;
      }).catch(() => {
        // Return offline page if available
        return caches.match('/index.html');
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for score submission
self.addEventListener('sync', event => {
  if (event.tag === 'sync-scores') {
    event.waitUntil(
      fetch('/api/sync-scores', { method: 'POST' })
        .then(response => response.json())
        .catch(() => console.log('Sync failed, will retry'))
    );
  }
});
