const CACHE = 'euro2k26-v5';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if(e.request.url.includes('exchangerate-api') || e.request.url.includes('fonts.googleapis') || e.request.url.includes('fonts.gstatic')) {
    e.respondWith(fetch(e.request).catch(()=>new Response('')));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(r => {
        if(r && r.status===200){ const cl=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cl)); }
        return r;
      }).catch(()=>cached);
      return cached || fresh;
    })
  );
});
