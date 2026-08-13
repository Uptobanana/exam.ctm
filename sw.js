var CACHE_NAME = 'tcm-exam-v2';
var CACHE_URLS = [
  './',
  './index.html',
  './app.js',
  './practical-exam.js',
  './mini-quiz-patch.js'
];

// Install: pre-cache core files
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all(
        CACHE_URLS.map(function(url) {
          return fetch(url).then(function(response) {
            if (response.ok) return cache.put(url, response);
          }).catch(function() {});
        })
      );
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
});

// Fetch: Cache-First for resources, Network-First for HTML
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var isHtml = event.request.headers.get('accept') &&
               event.request.headers.get('accept').indexOf('text/html') !== -1;

  if (isHtml) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
        return response;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        var fetchPromise = fetch(event.request).then(function(response) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
          return response;
        }).catch(function() {});
        return cached || fetchPromise;
      })
    );
  }
});
