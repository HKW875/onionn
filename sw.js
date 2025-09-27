// sw.js - basic install/caching/fetch strategy
const CACHE_NAME = 'Onionn-cache-v1';
const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './icons/android-launchericon-192-192.png',
  './icons/android-launchericon-512-512.png'
];

// Install: cache core files
self.addEventListener('install', event => {
  self.skipWaiting(); // activate worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  clients.claim();
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

// Fetch: navigation requests -> network-first then fallback to cache/offline
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Handle navigation requests (SPA routing)
  if (event.request.mode === 'navigate' ||
      (event.request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(event.request).then(networkResponse => {
        return networkResponse;
      }).catch(() => caches.match('./index.html').then(r => r || caches.match('./offline.html')))
    );
    return;
  }

  // For other requests: try cache first, then network, then offline fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(networkRes => {
        // cache copy for future requests
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkRes.clone());
          return networkRes;
        });
      }).catch(() => {
        // if it's an image request, maybe respond with an icon
        if (event.request.destination === 'image') return caches.match('./icons/android-launchericon-192-192.png');
        return caches.match('./offline.html');
      });
    })
  );
});

// firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDMc-z5-FwlbWwDt_dWdbk82SLpm9GCE38",
  authDomain: "onionn-790da.firebaseapp.com",
  projectId: "onionn-790da",
  storageBucket: "onionn-790da.firebasestorage.app",
  messagingSenderId: "838790352647",
  appId: "1:838790352647:web:8d263b00650740b4157fa2"
});

const messaging = firebase.messaging();

// Background handler
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icons/android-launchericon-192-192.png"
  });
});
