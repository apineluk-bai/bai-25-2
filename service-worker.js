const CACHE_NAME = "bai-trip-map-v2";
const urlsToCache = [
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "https://unpkg.com/leaflet/dist/leaflet.css",
  "https://unpkg.com/leaflet/dist/leaflet.js",
  "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"
];

// --- 설치 단계: 캐시 등록 ---
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// --- 활성화 단계: 이전 버전 캐시 삭제 ---
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// --- 요청 가로채기 ---
self.addEventListener("fetch", event => {
  const url = event.request.url;

  // ✅ API 요청은 캐시하지 않고 네트워크로 직접 전달
  if (url.includes("/api/") || url.includes("workers.dev")) {
    return;
  }

  // ✅ 정적 리소스만 캐시
  event.respondWith(
    caches.match(event.request).then(response => {
      // 캐시에 있으면 반환, 없으면 네트워크로 요청
      return response || fetch(event.request);
    })
  );
});
