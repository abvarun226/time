var cacheName = 'ayada:time:v4:static';

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
                './images/alarm-clock-24.png',
                './images/alarm-clock-144.png',
                './css/style.css',
                './css/crimson.css',
                './css/crimson.woff2',
                './css/bootstrap.min.css',
                './js/script.js',
                './js/popper.min.js',
                './js/moment.min.js',
                './js/moment-timezone-with-data.min.js',
                './js/jquery-3.3.1.slim.min.js',
                './js/bootstrap.min.js',
                './offline.html'
            ]).then(function() {
                self.skipWaiting();
            });
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});