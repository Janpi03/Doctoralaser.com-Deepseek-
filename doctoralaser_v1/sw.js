/* ─────────────────────────────────────────────────────
   DoctorLáser · sw.js
   Strategy:
     • Static HTML/CSS/JS/fonts → Cache First (fast repeat visits)
     • Images → Stale-While-Revalidate (fresh when possible)
     • Navigation fallback → /index.html when offline
   ───────────────────────────────────────────────────── */

var CACHE_VERSION = 'doctoralaser-v1.0';
var STATIC_CACHE  = CACHE_VERSION + '-static';
var IMAGE_CACHE   = CACHE_VERSION + '-images';

var STATIC_ASSETS = [
  '/',
  '/index.html',
  '/beneficios.html',
  '/tratamientos.html',
  '/evidencia.html',
  '/casos.html',
  '/agenda.html',
  '/404.html',
  '/css/styles.css',
  '/js/components.js',
  '/favicon.webp'
];

// ── INSTALL: pre-cache static shell ──────────────────
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: purge old caches ────────────────────────
self.addEventListener('activate', function(e) {
  var valid = [STATIC_CACHE, IMAGE_CACHE];
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return valid.indexOf(k) === -1; })
            .map(function(k)   { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// ── FETCH ─────────────────────────────────────────────
self.addEventListener('fetch', function(e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);

  // Skip cross-origin requests (fonts CDN, analytics, etc.)
  if (url.origin !== self.location.origin) return;

  var isImage = /\.(webp|jpg|jpeg|png|gif|svg|ico)$/i.test(url.pathname);

  if (isImage) {
    // Stale-While-Revalidate for images
    e.respondWith(staleWhileRevalidate(req, IMAGE_CACHE));
  } else {
    // Cache-First for shell assets; fallback to network then offline page
    e.respondWith(cacheFirstWithFallback(req));
  }
});

function cacheFirstWithFallback(req) {
  return caches.match(req).then(function(cached) {
    if (cached) return cached;
    return fetch(req).then(function(response) {
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(STATIC_CACHE).then(function(c) { c.put(req, clone); });
      }
      return response;
    }).catch(function() {
      // Offline fallback: return cached index for navigation requests
      if (req.destination === 'document') {
        return caches.match('/404.html') || caches.match('/index.html');
      }
    });
  });
}

function staleWhileRevalidate(req, cacheName) {
  return caches.open(cacheName).then(function(cache) {
    return cache.match(req).then(function(cached) {
      var networkFetch = fetch(req).then(function(response) {
        if (response && response.status === 200) {
          cache.put(req, response.clone());
        }
        return response;
      }).catch(function() { return cached; });

      return cached || networkFetch;
    });
  });
}
