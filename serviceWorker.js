const cachePacoFun = "cache-paco-fun-v1";
const assets = [
  "/",
  "/index.html",
  "/inicio.css",
  "/inicio.js",
  "/juego/index.html",
  "/juego/script.js",
  "/juego/styles.css",
  "/img/pacofun.png",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(cachePacoFun).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.skipWaiting()
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
