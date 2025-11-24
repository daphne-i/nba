const CACHE_NAME = 'league-terminal-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Install: Cache app shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS_TO_CACHE))
      .catch((err) => console.error('Failed to cache app shell:', err))
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network first for API, Cache first (stale-while-revalidate) for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip caching for API calls to ensure fresh data (unless offline)
  if (url.hostname.includes('api.espn.com')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Navigation (HTML): Network first with cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Cache valid responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If network fails, return nothing (cachedResponse handles it)
      });
      return cachedResponse || fetchPromise;
    })
  );
});