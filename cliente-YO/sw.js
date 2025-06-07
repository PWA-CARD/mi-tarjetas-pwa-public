const CACHE_NAME = 'tarjeta-jm-v1.0.2.4';
const CORE_ASSETS = [
  './index.html',
  './styles.css',
  './manifest.json',
  './sw.js',
  './icons/apple-icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
  // Si tienes otras imágenes estáticas que quieras cachear de inicio, añádelas aquí.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  // Sólo interceptamos GETs de recursos de nuestra propia PWA
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        // Si responde OK, lo guardamos en cache dinámico
        if (networkResponse && networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, cloned);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Opcional: podrías devolver una página de fallback si falla
        return caches.match('./index.html');
      });
    })
  );
});
