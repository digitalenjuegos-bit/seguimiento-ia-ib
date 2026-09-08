// ============================================
// SERVICE WORKER - Seguimiento IA
// Economía IB NM 2026 - Logos Academy
// ============================================
//
// IMPORTANTE: al actualizar CSS/JS, cambia CACHE_NAME a v2 (o superior)
// para invalidar la caché anterior y servir los archivos nuevos.
//
// Firebase y Google (SDK, RTDB, fuentes) se dejan en network-only:
// su persistencia offline es propia y cachear sus requests causaría
// conflictos con la conexión en tiempo real.

const CACHE_NAME = 'seguimiento-ia-ib-v2';

const ASSETS_TO_CACHE = [
  '/seguimiento-ia-ib/',
  '/seguimiento-ia-ib/index.html',
  '/seguimiento-ia-ib/css/styles.css',
  '/seguimiento-ia-ib/js/app.js',
  '/seguimiento-ia-ib/js/data.js',
  '/seguimiento-ia-ib/js/config.js',
  '/seguimiento-ia-ib/manifest.json',
  '/seguimiento-ia-ib/icons/icon-192.png',
  '/seguimiento-ia-ib/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Firebase y Google: network-only (SDK en gstatic, RTDB en firebaseio,
  // fuentes en googleapis/gstatic). No se cachean ni se responden offline.
  if (url.hostname.endsWith('firebaseio.com') ||
      url.hostname.endsWith('googleapis.com') ||
      url.hostname.endsWith('gstatic.com') ||
      url.hostname === 'firebase.google.com' ||
      url.hostname.endsWith('google.com')) {
    return;
  }

  // GET estáticos: cache-first, cacheando nuevos assets encontrados.
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  }
});
