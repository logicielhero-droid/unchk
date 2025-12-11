// Service Worker - Cache et offline support
const CACHE_NAME = 'isien-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/Genie Logiciel/logiciel.html',
  '/Réseau  INFORMATIQUE/reseau.html'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache).catch(() => {
          console.log('Certains fichiers ne pouvaient pas être mis en cache');
        });
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de cache: Network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone la réponse
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            return response || new Response('Page non disponible hors ligne');
          });
      })
  );
});
