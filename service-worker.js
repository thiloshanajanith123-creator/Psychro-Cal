const CACHE_NAME = 'psychro-cal-v1';

// Files to cache for offline usage
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon.png',
  'https://cdn.jsdelivr.net/npm/psychrolib@1.1.0/psychrolib.min.js'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request);
    })
  );
});
