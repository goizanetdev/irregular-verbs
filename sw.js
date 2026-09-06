/**
 * sw.js — Service Worker
 * Estrategia: cache-first para el "app shell", con actualización en segundo
 * plano (stale-while-revalidate) para que la app funcione 100% offline
 * después de la primera visita.
 */
const CACHE_NAME = "irregularverbs-cache-v4";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/verbs.js",
  "./js/gapSentences.js",
  "./js/storage.js",
  "./js/core.js",
  "./js/ui.js",
  "./js/stats.js",
  "./js/quiz.js",
  "./js/games.js",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/favicon-64.png",
  "./icons/logo-mark.png",
  "./favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
