const STATIC_CACHE = 'caderno-contas-static-v1';
const SHARE_CACHE = 'caderno-contas-share-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/logo.png', '/pwa-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => ![STATIC_CACHE, SHARE_CACHE].includes(key)).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST' && url.pathname === '/share-target') {
    event.respondWith(handleShareTarget(event.request));
    return;
  }

  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')));
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});

async function handleShareTarget(request) {
  try {
    const formData = await request.formData();
    const file =
      formData.get('backup') ||
      formData.get('file') ||
      [...formData.values()].find((value) => value && typeof value.text === 'function');

    if (!file || typeof file.text !== 'function') {
      return Response.redirect('/?shared-backup=missing', 303);
    }

    const text = await file.text();
    const cache = await caches.open(SHARE_CACHE);
    await cache.put(
      '/shared-backup.json',
      new Response(text, {
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    return Response.redirect('/?shared-backup=1', 303);
  } catch {
    return Response.redirect('/?shared-backup=error', 303);
  }
}
