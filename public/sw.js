const CACHE = 'kanzpay-v1';
const ASSETS = [
  '/', '/index.html', '/styles.css', '/app.js', '/manifest.webmanifest',
  '/assets/kanzpay-mark.png', '/assets/kanzpay-mark-dark.png',
  '/assets/kanzpay-logo.png', '/assets/kanzpay-logo-dark.png',
  '/assets/scene-skyline.png', '/assets/scene-buyer-hero.png',
  '/assets/scene-seller-hero.png', '/assets/scene-tap-nfc.png',
  '/assets/scene-coffee.png', '/assets/scene-gold-reward.png',
  '/assets/scene-card-exchange.png', '/assets/scene-catalogue.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request).catch(() => new Response(JSON.stringify({ error: 'offline' }), { headers: { 'content-type': 'application/json' } })));
    return;
  }
  event.respondWith(caches.match(event.request).then((hit) => hit || fetch(event.request).then((res) => {
    const copy = res.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return res;
  })));
});
