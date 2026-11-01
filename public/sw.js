/**
 * Glam Blocks - High-Performance Service Worker for 100% Offline Gameplay
 */

const CACHE_NAME = 'glam-blocks-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/logo.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/favicon.png',
];

// Install: pre-cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Stale-while-revalidate for assets, network-first with cache fallback for documents
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If offline and requesting navigation, serve cached index.html
          if (request.mode === 'navigate') {
            return caches.match('/index.html') as Promise<Response>;
          }
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
    })
  );
});
