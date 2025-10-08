const CACHE_NAME = "bai-trip-map-v1";
const urlsToCache = [
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "https://unpkg.com/leaflet/dist/leaflet.css",
  "https://unpkg.com/leaflet/dist/leaflet.js",
  "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", event => {
  const url = event.request.url;

  // ✅ 외부 API 요청은 캐시 무시 (Cloudflare / Apps Script)
  if (url.includes("workers.dev") || url.includes("googleapis.com") || url.includes("script.google.com")) {
    return; // 그냥 네트워크로 직접 보냄
  }

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
