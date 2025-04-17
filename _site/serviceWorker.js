var CACHE_NAME = "cookBook-cache-v2";
var CACHE_URL = [
  //Main HTML files, to load even if user hasn't visited page yet
  "/",
  "/_site/",
  "/_site/index.html",
  "/_site/about/",
  "/_site/about/index.html",
  "/_site/recipes/",
  "/_site/recipes/index.html"
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
    if (event.request.url.includes("/_site/img/recipes/57d2352f-600.jpeg")) {
      //"return event.respondwith" Prevents double calls since "return event.respondwith" is called twice in one event listener
     return event.respondWith(
        caches.match("/_site/img/recipes/upsideDownBrownies.jpg") //checks cache for the upside down brownies pic first
        .then(cached => cached || fetch("/_site/img/recipes/upsideDownBrownies.jpg"))
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