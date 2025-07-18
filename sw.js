const CACHE_NAME = 'cache-apps';



const urlsToCache = [
    '/index.html',
    '/css/styles.css?v=1.0.1',
    '/css/header.css?v=1.0.1',
    '/css/sidebar.css?v=1.0.1',
    '/css/search.css?v=1.0.1',
    '/css/chat.css?v=1.0.1',
    '/js/main.js?v=1.0.1',
    '/js/minifyJs.min.js?v=1.0.1',
    '/manifest.json?v=1.0.1'
]
const skipCdn = url => {
    try {
        const urlTest = new URL(url);
        return !!(urlTest.hostname.includes("cdn") ||
            urlTest.origin !== self.location.origin ||
            url.includes('contentScript.js') ||
            url.includes('chrome-extension'));
    } catch (e) {
        return true;
    }
}

self.addEventListener('install', (e) => {
    console.log('Service worker installed!');
    const promiseCache = caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
    })
    e.waitUntil(promiseCache);
});





self.addEventListener('activate', (e) => {
    console.log('Service worker activated!');
    const oldCache = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key!== CACHE_NAME) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(oldCache);
});





self.addEventListener('fetch', (e) => {
    if(skipCdn(e.request.url)){
        console.log('Ignoring request to CDN : ', e.request.url);
        return;
    }

    e.respondWith(
        fetch(e.request).then(response => {
            console.log('Url recupéré sur le reseau : ', e.request.url, response);
            caches.open('cache-apps').then(cache => cache.put(e.request, response));
            return response.clone();
        }).catch(error => {
            console.log('Erreur lors de la récupération de données on recupère depuis le cache: ', error);
            return  caches.match(e.request);
        })
    );
});


self.addEventListener('push', (e)=> {
    console.log('Push notification received!');
});

