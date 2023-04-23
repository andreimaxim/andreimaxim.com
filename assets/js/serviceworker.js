const staticCacheName = "DataAndreMaximComCache:v1";

addEventListener("install", event => {
    console.log("The service worker is installing...", event);
    event.waitUntil(
        caches.open(staticCacheName)
            .then( staticCache => {
                return staticCache.addAll([
                    "/assets/font/Inter-Regular.woff2",
                    "/assets/font/Inter-Bold.woff2",
                    "/assets/font/Inter-Italic.woff2"
                ]);
            })
    );
});

addEventListener("activate", event => {
    console.log("The service worker is activated.", event);
});

addEventListener("fetch", event => {
    // console.log("The service worker is listening.", event.request);

    let request = event.request;
    event.respondWith(
        caches.match(request)
            .then(cacheResponse => {
                return cacheResponse || fetch(request);
            })
    );
});