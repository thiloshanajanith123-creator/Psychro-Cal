const CACHE_NAME = 'psychro-cal-v3';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js',
  './assets/icon.png',
  'https://cdn.jsdelivr.net/npm/psychrolib@1.1.0/psychrolib.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {

  // Handle page navigation (offline fix)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(response => {
        return response || fetch('./index.html');
      })
    );
    return;
  }

  // Cache-first for other requests
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
