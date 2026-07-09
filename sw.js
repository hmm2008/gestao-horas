
const CACHE_NAME = 'gestao-horas-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Força a atualização imediata
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Apaga a versão 1 antiga
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // NOVA ESTRATÉGIA: Tenta a internet primeiro, se falhar usa a cache!
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
