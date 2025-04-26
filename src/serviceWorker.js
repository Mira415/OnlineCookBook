var CACHE_NAME = "cookBook-cache-v3";
var CACHE_URL = [
  //Main HTML files, to load even if user hasn't visited page yet
  "/",
  "/index.html",
  "/about/",
  "/about/index.html",
  "/recipes/",
  "/recipes/index.html",
  '/img/recipes/upsideDownBrownies.jpg'
]

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_URL);
    })
  );
});

//Change the Simple Brownies picture with an upside one
self.addEventListener("fetch", event => {
  if (event.request.url.includes('/img/recipes/sL5cvFkoGl-1500.webp') ||
  event.request.url.includes('/img/recipes/sL5cvFkoGl-600.webp')) {
    //"return event.respondwith" Prevents double calls since "return event.respondwith" is called twice in one event listener
    return event.respondWith(
      caches.match('/img/recipes/upsideDownBrownies.jpg')
        .then(cached => cached || fetch('/img/recipes/upsideDownBrownies.jpg'))
    );
  }
    //Chosen startegy: Cache on demand
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          return cachedResponse || fetch(event.request).then(
            networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
      })
    );
  })

  self.addEventListener("activate", event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (CACHE_NAME !== cacheName &&  cacheName.startsWith("cookBook-cache")) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
});