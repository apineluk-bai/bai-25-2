const CACHE_NAME = "bai-trip-map-v1";
const urlsToCache = [
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "https://unpkg.com/leaflet/dist/leaflet.css",
  "https://unpkg.com/leaflet/dist/leaflet.js"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", event => {
  const url = event.request.url;
  // 외부 API 캐시 제외
  if (url.includes("workers.dev") || url.includes("googleapis.com")) return;

  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
